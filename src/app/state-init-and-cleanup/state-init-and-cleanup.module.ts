import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StateInitAndCleanupContainerComponent} from "./state-init-and-cleanup.container.component";
import {StateInitAndCleanupBadComponent} from "./state-init-and-cleanup-bad.component";
import {StateInitAndCleanupGoodComponent} from "./state-init-and-cleanup-good.component";

export const ROUTES = [
    {
        path: '',
        component: StateInitAndCleanupContainerComponent
    }
];
const DECLARATIONS = [StateInitAndCleanupContainerComponent, StateInitAndCleanupBadComponent, StateInitAndCleanupGoodComponent];
@NgModule({
    declarations: [DECLARATIONS],
    imports: [
        CommonModule
    ],
  exports: [DECLARATIONS]
})
export class StateInitAndCleanupModule {

}
