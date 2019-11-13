import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatListModule,
    MatProgressBarModule
} from "@angular/material";
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
    MatListModule,
    MatButtonModule,
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
export class NotificationModule {
}
