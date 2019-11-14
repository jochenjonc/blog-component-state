import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LowLevelComponentStateComponent} from "./low-level-component-state.component";
import {LowLevelComponentStateContainerComponent} from "./low-level-component-state.container.component";

export const ROUTES = [
    {
        path: '',
        component: LowLevelComponentStateContainerComponent
    }
];
const DECLARATIONS = [LowLevelComponentStateContainerComponent, LowLevelComponentStateComponent];

@NgModule({
    declarations: [DECLARATIONS],
    imports: [
        CommonModule
    ],
    exports: [DECLARATIONS]
})
export class LowLevelComponentStateModule {

}
