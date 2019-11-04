import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArchitectureOverviewComponent} from "./architecture-overview.component";
import {ArchitectMVVMContainerComponent} from "./mvvm/mvvm-container.component";
import {ListMVVMComponent} from "./mvvm/list/list.component";
import {
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule
} from "@angular/material";
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
     ArchitectMVCContainerComponent
];
export const materialModules = [
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatBadgeModule
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
