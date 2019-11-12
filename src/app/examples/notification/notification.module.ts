import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule, MatExpansionModule, MatListModule} from "@angular/material";
import {NotificationContainerComponent} from "./notification.container.component";
import {MeetingList} from "./simple-list/meeting-list.component";


export const ROUTES = [
    {
        path: '',
        component: NotificationContainerComponent
    },
];
const DECLARATIONS = [
    NotificationContainerComponent, MeetingList
];
export const materialModules = [
    MatCardModule,
    MatExpansionModule,
    MatListModule
];

@NgModule({
    declarations: [DECLARATIONS],
    imports: [
        CommonModule,
        materialModules
    ],
    exports: [DECLARATIONS]
})
export class NotificationModule {
}
