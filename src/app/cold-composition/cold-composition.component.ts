import {Component, Input} from '@angular/core';
import {merge, of, ReplaySubject} from 'rxjs';
import {scan, tap} from 'rxjs/operators';

@Component({
    selector: 'cold-composition',
    template: `
        <h1>Cold Composition</h1>
        composed$: {{composed$ | async}}
    `
})
export class ColdCompositionComponent {
    tick$ = of(0).pipe();

    inputValue$ = new ReplaySubject(1);

    @Input()
    set inputValue(value) {
        console.log('input value', value);
        this.inputValue$.next(value);
    }

    composed$ = merge(this.inputValue$, this.tick$)
        .pipe(
            tap(console.log),
            scan((acc, i) => acc + i, 0),
            // publish()
        );

    constructor() {
        // (this.composed$ as ConnectableObservable<any>).connect();
    }

}
