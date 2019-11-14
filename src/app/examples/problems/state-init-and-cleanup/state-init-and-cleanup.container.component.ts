import {Component} from '@angular/core';
import {ComponentStateService} from "./component-state.service";

@Component({
    selector: 'state-init-and-cleanup-container',
    template: `
        <state-init-and-cleanup-bad></state-init-and-cleanup-bad>
        <state-init-and-cleanup-good></state-init-and-cleanup-good>
  `,
    providers: [ComponentStateService]
})
export class StateInitAndCleanupContainerComponent {

}
