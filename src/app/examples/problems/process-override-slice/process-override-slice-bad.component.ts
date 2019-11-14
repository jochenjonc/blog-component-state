import {ChangeDetectionStrategy, Component} from '@angular/core';
import {timer} from "rxjs";
import {map} from "rxjs/operators";
import {ProcessHandlerBadService} from "./process-handler-bad.service";

interface ProcessState {
    result1?: number;
    result2?: number;
}

@Component({
    selector: 'process-override-slice-bad',
    template: `
        <p><b>State$:</b></p>
        <button mat-raised-button color="primary"
                (click)="addProcess(1000, 'result1')">
            Process 1 with 1000ms
        </button>
        <button mat-raised-button color="primary"
                (click)="addProcess(200, 'result1')">
            Process 1 with 200ms
        </button>
        <button mat-raised-button color="primary"
                (click)="addProcess(1500, 'result2')">
            Process 1 with 1500ms
        </button>
        <pre>{{state$ | async | json}}</pre>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ProcessHandlerBadService]
})
export class ProcessOverrideSliceBadComponent {
    state$ = this.pH.state$;

    constructor(private pH: ProcessHandlerBadService<ProcessState>) {

    }

    addProcess(tick:number, slice: string) {
        this.pH.connectSlice(
            timer(0, tick).pipe(map(c => ({[slice]: c})))
        );
    }

}
