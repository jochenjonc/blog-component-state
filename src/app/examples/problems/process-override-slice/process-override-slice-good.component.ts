import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ProcessHandlerGoodService} from "./process-handler-good.service";
import {Observable, of, Subject, timer} from "rxjs";
import {map, switchMap} from "rxjs/operators";

interface ProcessState {
    result1?: number;
    result2?: number;
}

@Component({
    selector: 'process-override-slice-good',
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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessOverrideSliceGoodComponent {
    state$ = this.pH.state$;

    constructor(private pH: ProcessHandlerGoodService<ProcessState>) {

    }

    addProcess(tick:number, slice: string) {
        this.pH.connectSlice(
            timer(0, tick).pipe(map(c => ({[slice]: c})))
        );
    }



}
