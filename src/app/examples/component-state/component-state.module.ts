import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentStatePageComponent} from "./feature/component-state-page.component";
// @ts-ignore
import {ListComponent} from "./feature/components/component-state-list.component";
import {ReactiveFormsModule} from "@angular/forms";
import {GithubModule} from "../../data-access/github/github.module";
import {ListContainerComponent} from "./feature/list-container/list-container.component";

export const ROUTES = [
    {
        path: '',
        component: ComponentStatePageComponent
    }
];
const DECLARATIONS = [ComponentStatePageComponent, ListContainerComponent, ListComponent];

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
