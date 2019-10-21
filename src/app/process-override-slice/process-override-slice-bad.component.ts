import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Subject, timer} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {ProcessHandlerBadService} from "./process-handler-bad.service";

@Component({
    selector: 'process-override-slice-bad',
    template: `
        <p><b>State$:</b></p>
        <pre>{{state$ | async | json}}</pre>
        <button (click)="process1Ms$$.next(1000)">Process 1 with 1000ms</button>
        <button (click)="process1Ms$$.next(200)">Process 1 with 200ms</button>
        <button (click)="process2Ms$$.next(1500)">Process 2 with 1200ms</button>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessOverrideSliceBadComponent {
    state$ = this.pH.state$;

    process1Ms$$ = new Subject<number>();
    process2Ms$$ = new Subject<number>();

    process1$ = this.process1Ms$$
        .pipe(
            switchMap(ms => timer(0, ms)),
            map(n => ({prc1: n})),
        )
        .subscribe({next: c => this.pH.state$$.next(c)});

    process2$ = this.process2Ms$$
        .pipe(
            switchMap(ms => timer(0, ms)),
            map(n => ({prc2: n})),
        )
        .subscribe({next: c => this.pH.state$$.next(c)});

    constructor(private pH: ProcessHandlerBadService) {
        console.log('Container Constructor');
    }

}
