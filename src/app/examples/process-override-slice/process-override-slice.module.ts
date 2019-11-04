import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProcessOverrideSliceComponent} from "./process-override-slice.component";
import {ProcessOverrideSliceBadComponent} from "./process-override-slice-bad.component";

export const ROUTES = [
    {
        path: '',
        component: ProcessOverrideSliceComponent
    }
];
const DECLARATIONS = [ProcessOverrideSliceComponent, ProcessOverrideSliceBadComponent];

@NgModule({
    declarations: [DECLARATIONS],
    imports: [
        CommonModule
    ],
    exports: [DECLARATIONS]
})
export class ProcessOverrideSliceModule {

}
