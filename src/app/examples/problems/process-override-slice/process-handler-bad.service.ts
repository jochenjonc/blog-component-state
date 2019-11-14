import {Injectable, OnDestroy} from '@angular/core';
import {ConnectableObservable, merge, Observable, Subject, Subscription} from 'rxjs';
import {distinctUntilChanged, map, mergeAll, publishReplay, scan} from 'rxjs/operators';

const stateAccumulator = (acc, command): { [key: string]: number } => ({...acc, ...command});

@Injectable({
    providedIn: 'root'
})
export class ProcessHandlerBadService<T> implements OnDestroy {

    private subscription = new Subscription();
    private stateObservables = new Subject<Observable<T>>();
    private stateSlices = new Subject<T>();
    state$: Observable<T> =
        merge(
            this.stateObservables.pipe(mergeAll()),
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

    connectSlice(o: Observable<T>) {
        this.stateObservables.next(o);
    }
    select(selector?): Observable<T>  {
        return selector ? this.state$
            .pipe(
                map(s => selector(s)),
                distinctUntilChanged()
            ) : this.state$;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
