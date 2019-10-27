import {Component} from '@angular/core';
import {concat, interval, Observable, of, Subject} from 'rxjs';
import {ComponentStateService} from "./component-state.service";
import {map, take, tap} from "rxjs/operators";

const deleteUndefinedStateAccumulator = (state, [keyToDelete, value]: [string, number]): { [key: string]: number } => {
    const isKeyToDeletePresent = keyToDelete in state;
    // The key you want to delete is not stored :)
    if (!isKeyToDeletePresent && value === undefined) {
        return state;
    }
    // Delete slice
    if (value === undefined) {
        const {[keyToDelete]: v, ...newS} = state as any;
        return newS;
    }
    // update state
    return ({...state, [keyToDelete]: value});
};


@Component({
    selector: 'state-init-and-cleanup-good',
    template: `
        <button (click)="addDynamicState()">Add dynamic state</button>
        <p><b>state$:</b></p>
        <pre>{{state$ | async | json}}</pre>
    `,
    providers: [ComponentStateService]
})
export class StateInitAndCleanupGoodComponent {
    state$ = this.componentState.state$;

    constructor(private componentState: ComponentStateService) {
        this.componentState.stateAccumulator = deleteUndefinedStateAccumulator;
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

        const observables = [of({[id]: 0}), interval$, of({[id]: undefined})];
        return concat(...observables);
    }

}
