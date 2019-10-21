import {Component, Input} from '@angular/core';
import {ConnectableObservable, merge, of, ReplaySubject, Subject} from 'rxjs';
import {map, publish, publishReplay, scan, tap} from 'rxjs/operators';

@Component({
    selector: 'cold-composition',
    template: `
        <h1>Cold Composition</h1>
        composed$: {{composed$ | async | json}}
    `
})
export class ColdCompositionComponent {

    inputValue$ = new Subject();
    @Input()
    set inputValue(value) {
        console.log('inputValue:: value', value);
        this.inputValue$.next(value);
    }

    composed$ = merge(
        this.inputValue$
            .pipe(map(v => ({inputValue: v})))
        )
        .pipe(
            tap(v => console.log('tttt', v)),
            scan((acc, i) => {
                const [key, value] = Object.entries(i)[0];
                return ({...acc, [key]: (acc[key] || 0)+value})
            }, {}),
            publishReplay(1)
        );

    constructor() {
        (this.composed$ as ConnectableObservable<any>).connect();
    }

}
