import {Component, Input} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {scan, tap} from "rxjs/operators";

@Component({
    selector: 'cold-composition-bad',
    template: `
        <h1>Cold Composition Bad</h1>
        composed$: {{composed$ | async}}
    `
})
export class ColdCompositionBadComponent {

    inputValue$ = new ReplaySubject<number>(1);
    composed$ = this.inputValue$
        .pipe(
            tap(console.log),
            scan((acc, i) => acc + i, 0)
        );

    @Input()
    set inputValue(value) {
        console.log('input value', value);
        this.inputValue$.next(value);
    }

}
