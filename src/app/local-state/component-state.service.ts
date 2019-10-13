import {Injectable, OnDestroy} from '@angular/core';
import {animationFrameScheduler, ConnectableObservable, iif, Observable, Subject} from 'rxjs';
import {endWith, map, mergeAll, observeOn, publishReplay, scan, takeUntil} from 'rxjs/operators';

import {selectSlice} from './utils';

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

    select(selector: any): Observable<any> {
        return this.state$.pipe(selectSlice(selector));
    }

    connectSlices(slices: { [key: string]: Observable<any> }, config?: any): void {
        // @TODO validation / typing params
        // @TODO consider multiple observables for the same key. Here I would suggest last one wins => switchAll
        Object.entries(slices)
            .map(([slice, state$]) => {

                    const normal$ = state$
                        .pipe(map(state => ({[slice]: state})));

                    return iif(
                        () => config && 'endWith' in config,
                        normal$.pipe(endWith({[slice]: undefined})),
                        normal$
                    )
                }
            )
            .forEach(slice$ => this.commandObservable$$.next(slice$));
    }

    // @TODO implement key values to override effects
    connectEffects(effects: Observable<any>[]): void {
        // @TODO validation / typing params
        effects
            .forEach(effect$ => {
                this.effectObservable$$.next(effect$)
            });
    }

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
    }

}
