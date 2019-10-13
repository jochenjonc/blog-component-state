import {Component, Input} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {tap} from "rxjs/operators";

@Component({
    selector: 'cold-composition-bad',
    template: `
        <h1>Cold Composition Bad</h1>
        composed$: {{composed$ | async}}
    `
})
export class ColdCompositionBadComponent {

    inputValue$ = new ReplaySubject(1);
    composed$ = this.inputValue$
        .pipe(
            tap(console.log)
        );

    @Input()
    set inputValue(value) {
        this.inputValue$.next(value);
    }

}
