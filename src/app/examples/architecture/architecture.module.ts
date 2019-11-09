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
    MatListModule, MatProgressBarModule,
    MatProgressSpinnerModule
} from "@angular/material";
import {ArchitectMVCContainerComponent} from "./mcv/mvc-container.component";
import {SimpleListMVVMComponent} from "./mvvm/simple-list/simple-list.component";
import {SelectPipe} from "./select.pipe";
import {NoArchitectureContainerComponent} from "./no-architecture/no-architecture-container.component";
import {SimpleListNoArchitectureComponent} from "./no-architecture/simple-list/simple-list.component";
import {SimpleListMVCComponent} from "./mcv/simple-list/simple-list.component";
import {ListMVCComponent} from "./mcv/list/list.component";
import {ArchitectMVAContainerComponent } from "./mva/mva-container.component";
import {SimpleListMVAComponent} from "./mva/simple-list/simple-list.component";
import {SimpleListNoArchitectureImpComponent} from "./no-architecture/simple-list-imp/simple-list-imp.component";


export const ROUTES = [
    {
        path: '',
        component: ArchitectureOverviewComponent
    },
    {path: 'mvvm', component: ArchitectMVVMContainerComponent},
    {path: 'mvc', component: ArchitectMVCContainerComponent},
    {path: 'mva', component: ArchitectMVAContainerComponent},
    {path: 'no-architecture', component: NoArchitectureContainerComponent}
];
const DECLARATIONS = [
    ArchitectureOverviewComponent,
    SimpleListNoArchitectureComponent, SimpleListNoArchitectureImpComponent,
    NoArchitectureContainerComponent,
    SimpleListMVVMComponent, ListMVVMComponent,
    ArchitectMVVMContainerComponent,
    SimpleListMVCComponent, ListMVCComponent,
    ArchitectMVCContainerComponent,
    SimpleListMVAComponent,
    ArchitectMVAContainerComponent,
    SelectPipe
];
export const materialModules = [
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
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
