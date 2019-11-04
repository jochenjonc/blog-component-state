import {Component} from '@angular/core';
import {concat, interval, Observable, of, Subject, timer} from 'rxjs';
import {ComponentStateService} from "./component-state.service";
import {map, take, tap} from "rxjs/operators";

@Component({
    selector: 'state-init-and-cleanup-bad',
    template: `
    <button (click)="addDynamicState()">Add dynamic state</button>
    <p><b>state$:</b></p>
    <pre>{{state$ | async | json}}</pre>
  `,
    providers: [ComponentStateService]
})
export class StateInitAndCleanupBadComponent {
    state$ = this.componentState.state$;

    constructor(private componentState: ComponentStateService) {
    }

    addDynamicState() {
        this.componentState.connectSlice(this.getDynamicStateSlice())
    }

    getDynamicStateSlice(): Observable<{ [key: string]: number | undefined }> {
        const rnd = (p = 1): number => ~~(Math.random() * (10 ** p));
        const takeCount = rnd(1);
        const intervalDuration = rnd(3);
        const id = `rnd ${rnd(2)}-${intervalDuration}-${takeCount}`;
        const interval$ = interval(intervalDuration).pipe(map(_ => ({[id]: rnd()})), take(takeCount));

        const observables = [of({[id]: 0}), interval$];
        return concat(...observables);
    }


}
