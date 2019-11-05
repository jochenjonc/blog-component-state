import {Injectable, OnDestroy} from '@angular/core';
import {
    animationFrameScheduler,
    ConnectableObservable,
    Observable,
    OperatorFunction,
    Subject,
    Subscription
} from 'rxjs';
import {distinctUntilChanged, map, mergeAll, observeOn, publishReplay, scan, takeUntil} from 'rxjs/operators';

export interface SliceConfig {
    starWith?: any,
    endWith?: any,
}

const stateAccumulator = (acc, command): { [key: string]: number } => ({...acc, ...command});

export class LowLevelStateService implements OnDestroy {
    private subscription = new Subscription();
    private effectSubject = new Subject<Observable<{ [key: string]: number }>>();
    private stateSubject = new Subject<Observable<{ [key: string]: number }>>();

    state$ = this.stateSubject
        .pipe(
            mergeAll(),
            scan(stateAccumulator, {}),
            publishReplay(1)
        ) as ConnectableObservable<any>;


    constructor() {
        this.subscription.add(this.state$.connect());
        this.subscription.add((this.effectSubject
            .pipe(mergeAll(), publishReplay(1)
            ) as ConnectableObservable<any>).connect()
        );
    }

    connectSlice(o) {
        this.stateSubject.next(o);
    }

    connectEffect(o) {
        this.effectSubject.next(o);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
