import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ProcessHandlerGoodService} from "./process-handler-good.service";
import {Subject, timer} from "rxjs";
import {map, switchMap} from "rxjs/operators";

@Component({
    selector: 'process-override-slice-container',
    template: `
    <p><b>Process Overrides:</b></p>
    <process-override-slice-bad>
    </process-override-slice-bad>      
    <process-override-slice-good>
    </process-override-slice-good>        
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ProcessHandlerGoodService]
})
export class ProcessOverrideSliceContainerComponent {
    state$ = this.pH.state$;

    process1Ms$$ = new Subject<number>();
    process2Ms$$ = new Subject<number>();

    constructor(private pH: ProcessHandlerGoodService<{count: number}>) {
        this.pH.connectSlice(this.process1Ms$$
                .pipe(switchMap(ms => timer(0, ms).pipe(map(count => ({count}) ))))
        );
        this.pH.connectSlice(this.process2Ms$$
            .pipe(switchMap(ms => timer(0, ms).pipe(map(c => ({count: c*10})))))
        );
    }

}
