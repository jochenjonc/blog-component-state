import {Component, Input} from '@angular/core';
import {merge, of, ReplaySubject} from 'rxjs';
import {scan, tap, map} from "rxjs/operators";

@Component({
    selector: 'cold-composition-bad',
    template: `
        <h1>Cold Composition Bad</h1>
        {{asyncPipeFired$ | async}}
        composed$: {{composed$ | async | json}}
    `
})
export class ColdCompositionBadComponent {
    asyncPipeFired$ = of('BAD async pipe fired').pipe(tap(console.log));


    inputValue$ = new ReplaySubject<number>(1);
    @Input()
    set inputValue(value) {
        console.log('set inputValue', value);
        this.inputValue$.next(value);
    }

    otherInputValue$ = new ReplaySubject<number>(1);
    @Input()
    set otherInputValue(value) {
        console.log('set otherInputValue', value);
        this.otherInputValue$.next(value);
    }

    composed$ = merge(
        this.inputValue$
            .pipe(map(v => ({inputValue: v}))),
        this.otherInputValue$
            .pipe(map(v => ({otherInputValue: v}))),
    )
        .pipe(
            scan((acc, i) => {
                console.log('acc', acc,'i', i);
                const [key, value] = Object.entries(i)[0];
                return ({...acc, [key]: (acc[key] || 0)+value});
            }, {})
        );

    constructor() {
        console.log('CTOR BAD', );
    }

}
