import {Injectable, OnDestroy} from '@angular/core';
import {animationFrameScheduler, ConnectableObservable, iif, Observable, OperatorFunction, Subject} from 'rxjs';
import {distinctUntilChanged, endWith, map, mergeAll, observeOn, publishReplay, scan, takeUntil} from 'rxjs/operators';

export interface SliceConfig {
    starWith?: any,
    endWith?: any,
}

@Injectable({
    providedIn: 'root'
})
export class ComponentStateService implements OnDestroy {

    onDestroy$ = new Subject();

    private effectObservable$$ = new Subject();
    private effect$ = this.effectObservable$$
        .pipe(
            mergeAll(),
            takeUntil(this.onDestroy$),
            // @NOTE when scheduled over animation frame the process stops when the user leaving the tab
            observeOn(animationFrameScheduler),
            publishReplay(1)
        );

    private commandObservable$$ = new Subject();
    private state$: Observable<any> =
        this.commandObservable$$
            .pipe(
                mergeAll(),
                scan((s, c) => {
                    const [keyToDelete, value]: [string, any] = Object.entries(c)[0];
                    const isKeyToDeletePresent = keyToDelete in s;
                    // The key you want to delete is not stored :)
                    if (!isKeyToDeletePresent && value === undefined) {
                        return s;
                    }
                    // Delete slice
                    if (value === undefined) {
                        const {[keyToDelete]: v, ...newS} = s as any;
                        return newS;
                    }
                    // update state
                    return ({...s, ...c});
                }, {}),
                takeUntil(this.onDestroy$),
                publishReplay(1)
            );

    constructor() {
        // the local state service's `state$` observable should be hot on instantiation
        const subscription = (this.state$ as ConnectableObservable<any>).connect();
        subscription.add((this.effect$ as ConnectableObservable<any>).connect());

        this.onDestroy$.subscribe(_ => subscription.unsubscribe());
    }

    select<T, R>(operator: OperatorFunction<T, R>) {
        return this.state$.pipe(
            operator,
            // @TODO what if we select a state that is not given?
            distinctUntilChanged<R>()
        );
    }

    connectSlices<T>(slices: { [key: string]: Observable<T> }, config?: SliceConfig): void {
        // @TODO validation / typing params
        // @TODO consider multiple observables for the same key. Here I would suggest last one wins => switchAll
        Object.entries(slices)
            .map(([slice, state$]) => {
                    const default$ = state$
                        .pipe(map(state => ({[slice]: state})));
                    // @TODO implement proper usage of SliceConfig
                    return iif(
                        () => config && 'endWith' in config,
                        default$.pipe(endWith({[slice]: undefined})),
                        default$
                    );
                }
            )
            .forEach(slice$ => this.commandObservable$$.next(slice$));
    }

    // @TODO implement key values to override effects
    connectEffects<T>(effects: { [key: string]: Observable<T> }): void {
        // @TODO validation / typing params
        Object.entries(effects)
            .map(([name, effect$]) => effect$)
                //.pipe(map(state => ({[name]: state})))
            .forEach(effect$ => this.effectObservable$$.next(effect$));
    }

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
    }

}
