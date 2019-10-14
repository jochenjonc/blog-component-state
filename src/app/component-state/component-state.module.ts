import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentStatePageComponent} from "./component-state-page.component";
import {ComponentStateContainerComponent} from "./component-state-container.component";
import {ComponentStateListComponent} from "./component-state-list.component";
import {ReactiveFormsModule} from "@angular/forms";

export const ROUTES = [
    {
        path: '',
        component: ComponentStatePageComponent
    }
];
const DECLARATIONS = [ComponentStatePageComponent, ComponentStateContainerComponent, ComponentStateListComponent];

@NgModule({
    declarations: [DECLARATIONS],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [DECLARATIONS]
})
export class ComponentStateModule {
}
