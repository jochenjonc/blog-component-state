import {Component, Input} from '@angular/core';
import {ConnectableObservable, interval, merge, of, ReplaySubject} from 'rxjs';
import {publish, scan, share, tap} from 'rxjs/operators';

@Component({
    selector: 'cold-composition',
    template: `
        <h1>Cold Composition</h1>
        composed$: {{composed$ | async}}
    `
})
export class ColdCompositionComponent {
    tick$ = of().pipe();

    inputValue$ = new ReplaySubject(1);

    @Input()
    set inputValue(value) {
        console.log('Input value', value);
        this.inputValue$.next(value);
    }

    composed$ = merge(this.inputValue$, this.tick$)
        .pipe(
            tap(console.log),
            scan((acc, i) => acc + i, 0),
       //   publish()
        );

    constructor() {
       // (this.composed$ as ConnectableObservable<any>).connect();
    }

}
