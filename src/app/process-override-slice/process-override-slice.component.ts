import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ProcessHandlerService} from "./process-handler.service";
import {Subject, timer} from "rxjs";
import {map, switchMap} from "rxjs/operators";

@Component({
    selector: 'process-override-slice',
    template: `
        <p><b>State$:</b></p>
        <pre>{{state$ | async | json}}</pre>
        <button (click)="process1Ms$$.next(1000)">Process 1 with 1000ms</button>
        <button (click)="process1Ms$$.next(200)">Process 1 with 200ms</button>
        <button (click)="process2Ms$$.next(1500)">Process 2 with 1200ms</button>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessOverrideSliceComponent {
    state$ = this.pH.state$;

    process1Ms$$ = new Subject<number>();
    process2Ms$$ = new Subject<number>();

    constructor(private pH: ProcessHandlerService) {
        this.pH.connectSlice(this.process1Ms$$
                .pipe(switchMap(ms => timer(0, ms)))
        );
        this.pH.connectSlice(this.process2Ms$$
            .pipe(switchMap(ms => timer(0, ms).pipe(map(v => v*10))))
        );
    }

}
