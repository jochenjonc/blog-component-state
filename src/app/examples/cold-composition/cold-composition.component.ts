import {Component, Input} from '@angular/core';
import {of, ReplaySubject} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {SomeGoodService} from "./some-good.service";

@Component({
    selector: 'cold-composition',
    template: `
        {{asyncPipeFired$ | async}}
        <h1>Cold Composition Good</h1>
        composed$: {{someGoodService.composedState$ | async | json}}
    `,
    providers: [SomeGoodService]
})
export class ColdCompositionComponent {
    asyncPipeFired$ = of(' ').pipe(tap(_ => console.log('CC-Good async pipe fired')));

    inputValue$ = new ReplaySubject<number>(1);
    @Input()
    set inputValue(value) {
        console.log('set CC-Bad inputValue', value);
        this.inputValue$.next(value);
    }

    constructor(public someGoodService: SomeGoodService) {
        console.log('CTOR CC-Bad');
        // earliest possible moment to forward values
        this.inputValue$
            .pipe(map(n => ({sum: n})))
            .subscribe(
                n => this.someGoodService.commands$.next(n)
            );
        // earliest possible moment to subscribe to a service
        this.someGoodService.composedState$.subscribe(s => console.log('composedState good: ', s) );
    }


    ngOnDestroy(): void {
        this.inputValue$.complete()
    }


}
