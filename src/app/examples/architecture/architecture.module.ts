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
    MatListModule,
    MatProgressSpinnerModule
} from "@angular/material";
import {ArchitectMVCContainerComponent} from "./mcv/mvc-container.component";
import {SimpleListMVVMComponent} from "./mvvm/simple-list/simple-list.component";
import {SelectPipe} from "./select.pipe";
import {NoArchitectureContainerComponent} from "./no-architecture/no-architecture-container.component";
import {SimpleListNoArchitectureComponent} from "./no-architecture/simple-list/simple-list.component";


export const ROUTES = [
    {
        path: '',
        component: ArchitectureOverviewComponent
    },
    {
        path: 'mvvm',
        component: ArchitectMVVMContainerComponent
    },
    {path: 'mvc', component: ArchitectMVCContainerComponent},
    {path: 'no-architecture', component: NoArchitectureContainerComponent}
];
const DECLARATIONS = [
    SimpleListMVVMComponent, ListMVVMComponent,
    ArchitectMVVMContainerComponent,
    ArchitectMVCContainerComponent,
    NoArchitectureContainerComponent,
    SimpleListNoArchitectureComponent,
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
