import {OnDestroy} from '@angular/core';
import {ConnectableObservable, Observable, Subject, Subscription} from 'rxjs';
import {map, mergeAll, publishReplay, scan} from 'rxjs/operators';


export class DeclarativeInteractionGoodService implements OnDestroy {
    private stateSubscription = new Subscription();

    private stateSubject = new Subject<Observable<{ [key: string]: number }>>();
    state$ = this.stateSubject
        .pipe(
            // process observables of state changes
            mergeAll(),
            // process single state change
            map(obj => Object.entries(obj).pop()),
            scan((acc, [key, value]: [string, number]): { [key: string]: number } => ({...acc, [key]: value}), {}),
            publishReplay(1)
        ) as ConnectableObservable<any>;


    constructor() {
        this.stateSubscription = this.state$.connect();
    }

    ngOnDestroy(): void {
        this.stateSubscription.unsubscribe();
    }

    connectSlice(o) {
        this.stateSubject.next(o);
    }

}
