import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArchitectureOverviewComponent} from "./architecture-overview.component";
import {ArchitectMVVMContainerComponent} from "./mvvm/mvvm-container.component";
import {ListMVVMComponent} from "./mvvm/list/list.component";
import {ListMVCComponent} from "./mcv/list-view/list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule, MatListModule} from "@angular/material";
import {ArchitectMVCContainerComponent} from "./mcv/mvc-container.component";
import {SimpleListMVVMComponent} from "./mvvm/simple-list/simple-list.component";

export const ROUTES = [
    {
        path: '',
        component: ArchitectureOverviewComponent
    },
    {
        path: 'mvvm',
        component: ArchitectMVVMContainerComponent
    },
    { path: 'mvc', component: ArchitectMVCContainerComponent}
];
const DECLARATIONS = [
    SimpleListMVVMComponent, ListMVVMComponent,
    ArchitectMVVMContainerComponent,
     ListMVCComponent,
     ArchitectMVCContainerComponent
];
export const materialModules = [
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule
];

@NgModule({
    declarations: [DECLARATIONS],
    imports: [
        CommonModule,
        materialModules
    ],
    exports: [DECLARATIONS]
})
export class ArchitectureModule {
}
