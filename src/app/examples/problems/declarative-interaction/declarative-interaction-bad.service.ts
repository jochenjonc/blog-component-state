import {OnDestroy} from '@angular/core';
import {ConnectableObservable, Subject, Subscription} from 'rxjs';
import {map, publishReplay, scan} from 'rxjs/operators';

const stateAccumulator = (acc, [key, value]: [string, number]): { [key: string]: number } => ({...acc, [key]: value});

export class DeclarativeInteractionBadService implements OnDestroy {
    private stateSubscription = new Subscription();
    private stateAccumulator = stateAccumulator;

    private stateSubject = new Subject<{ [key: string]: number }>();
    state$ = this.stateSubject
        .pipe(
            // process single state change
            map(obj => Object.entries(obj).pop()),
            scan(this.stateAccumulator, {}),
            publishReplay(1)
        ) as ConnectableObservable<any>;


    constructor() {
        this.stateSubscription =  this.state$.connect();
    }

    ngOnDestroy(): void {
        this.stateSubscription.unsubscribe();
    }

    // setter with value not compose-able
    dispatch(v) {
        this.stateSubject.next(v);
    }

}
