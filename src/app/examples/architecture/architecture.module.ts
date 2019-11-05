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
    MatListModule, MatProgressSpinnerModule
} from "@angular/material";
import {ArchitectMVCContainerComponent} from "./mcv/mvc-container.component";
import {SimpleListMVVMComponent} from "./mvvm/simple-list/simple-list.component";
import {SelectPipe} from "./select.pipe";

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
     ArchitectMVCContainerComponent,
    SelectPipe
];
export const materialModules = [
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatBadgeModule,
    MatProgressSpinnerModule
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
