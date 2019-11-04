import {Injectable, OnDestroy} from '@angular/core';
import {ConnectableObservable, merge, Observable, Subject, Subscription} from 'rxjs';
import {mergeAll, publishReplay, scan} from 'rxjs/operators';

export interface SliceConfig {
    starWith?: any,
    endWith?: any,
}

const stateAccumulator = (acc, command): { [key: string]: number } => ({...acc, ...command});

@Injectable()
export class LowLevelStateService<T> implements OnDestroy {
    private subscription = new Subscription();
    private effectSubject = new Subject<Observable<{ [key: string]: number }>>();
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
        this.subscription.add((this.effectSubject
            .pipe(mergeAll(), publishReplay(1)
            ) as ConnectableObservable<any>).connect()
        );
    }

    setSlice(s: T) {
        this.stateSlices.next(s);
    }

    connectSlice(o: Observable<T>) {
        this.stateObservables.next(o);
    }

    connectEffect(o: Observable<any>) {
        this.effectSubject.next(o);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
