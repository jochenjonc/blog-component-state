import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {scan} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class SomeBadService implements OnDestroy {
    // one channel for different requests for changes
    commands$ = new Subject();
    composedState$ = this.commands$
        .pipe(
            scan((acc, i) => {
                console.log('SomeService composition', i);
                return {sum : acc['sum'] + i['sum']};
            }, {sum: 0})
        );

    constructor() {
        console.log('CTOR SomeService');
        // for logging reasons only
        this.commands$.subscribe(c => console.log('new command: ', c) );

        // initial value from constant
        this.commands$.next({sum: 100});
        // initial value from other service
        this.commands$.next({sum: 25});
    }

    ngOnDestroy(): void {
        this.commands$.complete();
    }

}
