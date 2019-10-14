import {Component, Input} from '@angular/core';
import {ConnectableObservable, merge, of, ReplaySubject, Subject} from 'rxjs';
import {publish, publishReplay, scan, tap} from 'rxjs/operators';

@Component({
    selector: 'cold-composition',
    template: `
        <h1>Cold Composition</h1>
        composed$: {{composed$ | async | json}}
    `
})
export class ColdCompositionComponent {
    tick$ = of({tick: 1}, {tick: 2}, {tick: 3}).pipe();

    inputValue$ = new Subject();

    @Input()
    set inputValue(value) {
        console.log('input value', value);
        this.inputValue$.next(value);
    }

    composed$ = merge(this.inputValue$, this.tick$)
        .pipe(
            tap(console.log),
            scan((acc, i) => {
                const [key, value] = Object.entries(i)[0];
                return ({...acc, [key]: (acc[key] || 0)+value})
            }, {}),
            publishReplay()
        );

    constructor() {
        (this.composed$ as ConnectableObservable<any>).connect();
    }

}
