import {Component, Input} from '@angular/core';
import {interval, of, Subject} from "rxjs";
import {map, tap} from "rxjs/operators";
import {LowLevelStateService} from "./low-level-component-state.service";

@Component({
    selector: 'low-level-state-container',
    template: `
        <low-level-state-component
        [value]="value$ | async"></low-level-state-component>
    `,
    providers: [LowLevelStateService]
})
export class LowLevelComponentStateContainerComponent {
    value$ = of(5000);
}
