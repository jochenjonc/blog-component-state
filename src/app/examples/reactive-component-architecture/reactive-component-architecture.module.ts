import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {ReactiveComponentArchitectureContainerComponent} from "./reactive-component-architecture.container.component";
import {PageComponent} from "./container/page.component";
import {ListComponent} from "./components/list.component";

export const ROUTES = [
    {
        path: '',
        component: PageComponent
    }
];
const DECLARATIONS = [
    ReactiveComponentArchitectureContainerComponent,
    PageComponent,
    ListComponent
];

@NgModule({
    declarations: [DECLARATIONS],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [DECLARATIONS]
})
export class ReactiveComponentArchitectureModule {
}
