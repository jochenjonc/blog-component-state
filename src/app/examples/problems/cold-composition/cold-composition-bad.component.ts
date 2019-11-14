import {Component, Input, OnDestroy} from '@angular/core';
import {of, ReplaySubject, Subject} from 'rxjs';
import {map, tap} from "rxjs/operators";
import {SomeBadService} from "./some-bad.service";

@Component({
    selector: 'cold-composition-bad',
    template: `
        <h1>Cold Composition Bad</h1>
        {{asyncPipeFired$ | async }}
        someService.composedState$: {{someBadService.composedState$ | async | json}}
    `,
    providers: [SomeBadService]
})
export class ColdCompositionBadComponent implements OnDestroy {
    asyncPipeFired$ = of(' ').pipe(tap(_ => console.log('CC-Bad async pipe fired')));

    inputValue$ = new Subject<number>();
    @Input()
    set inputValue(value) {
        console.log('set CC-Bad inputValue', value);
        this.inputValue$.next(value);
    }

    constructor(public someBadService: SomeBadService) {
        console.log('CTOR CC-Bad');
        // earliest possible moment to forward values
        this.inputValue$
            .pipe(map(n => ({sum: n})))
            .subscribe(
                n => this.someBadService.commands$.next(n)
            );
        // earliest possible moment to subscribe to a service
        this.someBadService.composedState$.subscribe(s => console.log('composedState bad: ', s) );
    }

    ngOnDestroy(): void {
        this.inputValue$.complete()
    }

}
