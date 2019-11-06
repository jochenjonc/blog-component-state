import {Injectable, OnDestroy} from '@angular/core';
import {ConnectableObservable, merge, Observable, of, Subject, Subscription} from 'rxjs';
import {distinctUntilChanged, groupBy, map, mergeAll, publishReplay, scan, switchMap, tap} from 'rxjs/operators';

const stateAccumulator = (acc, command): { [key: string]: number } => ({...acc, ...command});

export interface BehaviourConfig<T> {
    // The strategy to use. (merge, switch)
    strategy?: string,
    // Identifier for the observable behaviour
    behaviourName?: string,
    changes: Observable<T>
}


@Injectable({
    providedIn: 'root'
})
export class ProcessHandlerGoodService<T> implements OnDestroy {

    private subscription = new Subscription();
    private stateObservables = new Subject<{
        strategy?: string,
        behaviourName?: string,
        changes: Observable<T>
    }>();
    private stateSlices = new Subject<T>();
    state$: Observable<T> =
        merge(
            this.stateObservables
                .pipe(
                    // map(({strategyName, changes}) => ({strategyName:changes})),
                    this.flattenByStrategy()
                ),
            this.stateSlices
        )
            .pipe(
                scan(stateAccumulator, {}),
                publishReplay(1)
            );


    constructor() {
        this.subscription.add((this.state$ as ConnectableObservable<any>).connect());
    }

    setSlice(s: T) {
        this.stateSlices.next(s);
    }

    connectSlice(o: Observable<T>, behaviourName?: string, strategy = 'merge') {
        console.log(strategy, behaviourName);
        this.stateObservables.next({changes: o, strategy, behaviourName});
    }

    select(selector?): Observable<T> {
        return selector ? this.state$
            .pipe(
                map(s => selector(s)),
                distinctUntilChanged()
            ) : this.state$;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    flattenByStrategy() {
        return (behaviourConfig$: Observable<BehaviourConfig<T>>): Observable<any> => {
            return behaviourConfig$.pipe(
                // {behaviourName, observable} => Observable<>
                groupBy((cfg) => cfg.behaviourName),
                tap(v => console.log('OOOOO', v)),
                map(gO => {

                    return gO.pipe(map(c => c.changes))
                }),
                mergeAll()
            );
        }
    }

}
