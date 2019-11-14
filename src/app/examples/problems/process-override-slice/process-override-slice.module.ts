import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProcessOverrideSliceContainerComponent} from "./process-override-slice.container.component";
import {ProcessOverrideSliceBadComponent} from "./process-override-slice-bad.component";
import {ProcessOverrideSliceGoodComponent} from "./process-override-slice-good.component";
import {MatButtonModule} from "@angular/material";

export const ROUTES = [
    {
        path: '',
        component: ProcessOverrideSliceContainerComponent
    }
];
const DECLARATIONS = [ProcessOverrideSliceContainerComponent,
    ProcessOverrideSliceBadComponent, ProcessOverrideSliceGoodComponent];

@NgModule({
    declarations: [DECLARATIONS],
    imports: [
        CommonModule,
        MatButtonModule
    ],
    exports: [DECLARATIONS]
})
export class ProcessOverrideSliceModule {

}
