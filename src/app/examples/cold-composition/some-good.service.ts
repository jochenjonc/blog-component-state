import {Injectable, OnDestroy} from '@angular/core';
import {ConnectableObservable, merge, of, Subject, Subscription} from 'rxjs';
import {publishReplay, scan} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class SomeGoodService implements OnDestroy {
    commands$ = new Subject();
    serviceSubscription = new Subscription();
    composedState$ = this.commands$
        .pipe(
            scan((acc, i) => {
                console.log('SomeService composition', i);
                return {sum : acc['sum'] + i['sum']};
            }, {sum: 0}),
            publishReplay(1)
        ) as ConnectableObservable<any>;

    constructor() {
        console.log('CTOR SomeService');
        this.serviceSubscription = this.composedState$.connect();

        // for logging reasons only
        this.commands$.subscribe(c => console.log('new command: ', c) );

        // initial value from constant
        this.commands$.next({sum: 100});
        // initial value from other service
        this.commands$.next({sum: 25});
    }

    ngOnDestroy(): void {
        this.serviceSubscription.unsubscribe();
    }

}
