import {OnDestroy} from '@angular/core';
import {ConnectableObservable, Subject, Subscription} from 'rxjs';
import {map, publishReplay, scan} from 'rxjs/operators';


export class DeclarativeInteractionBadService implements OnDestroy {
    private stateSubscription = new Subscription();

    private stateSubject = new Subject<{ [key: string]: number }>();
    state$ = this.stateSubject
        .pipe(
            // process single state change
            map(obj => Object.entries(obj).pop()),
            scan((state, [slice, value]: [string, number]): { [key: string]: number } => ({...state, [slice]: value}), {}),
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
