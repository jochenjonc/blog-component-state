import {Component, Input} from '@angular/core';
import {interval, Subject} from "rxjs";
import {map, tap} from "rxjs/operators";
import {LowLevelStateService} from "./low-level-component-state.service";

@Component({
    selector: 'low-level-state-component',
    template: `
        <p>Low-Level StateService</p>
        state$: <pre>{{state$ | async | json}}</pre>
        <button (click)="btn$.next($event)">
            Update Click Time
        </button>
    `,
    providers: [LowLevelStateService]
})
export class LowLevelComponentStateComponent {
    sideEffect$ = interval(1000)
        .pipe(tap(_ => (console.log('Dispatch action to global store'))));

    state$ = this.stateService.state$;

    value$ = new Subject<number>();
    @Input()
    set value(value) {
        this.value$.next(value);
    }
    btn$ = new Subject<any>();

    constructor(private stateService: LowLevelStateService) {
        this.stateService
            .connectEffect(this.sideEffect$);
        this.stateService
            .connectSlice(this.value$.pipe(map(n => ({interval: n}))));
        this.stateService
            .connectSlice(this.btn$.pipe(map(e => ({time: e.timeStamp}))));
    }

}
