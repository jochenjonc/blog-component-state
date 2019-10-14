import {Component, Input} from '@angular/core';
import {merge, of, ReplaySubject} from 'rxjs';
import {scan, tap} from "rxjs/operators";

@Component({
    selector: 'cold-composition-bad',
    template: `
        <h1>Cold Composition Bad</h1>
        composed$: {{composed$ | async | json}}
    `
})
export class ColdCompositionBadComponent {
    tick$ = of({tick: 1}, {tick: 2}, {tick: 3}).pipe();

    inputValue$ = new ReplaySubject<number>(1);

    @Input()
    set inputValue(value) {
        this.inputValue$.next(value);
    }

    composed$ = merge(this.inputValue$, this.tick$)
        .pipe(
            tap(console.log),
            scan((acc, i) => {
                const [key, value] = Object.entries(i)[0];
                return ({...acc, [key]: (acc[key] || 0)+value});
            }, {})
        );


}
