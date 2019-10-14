import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LateSubscribersContainerComponent} from "./late-subscriber.container.component";
import {LateSubscriberDisplayComponent} from "./late-subscriber.display.component";

export const ROUTES = [
    {
        path: '',
        component: LateSubscribersContainerComponent
    }
];
const DECLARATIONS = [LateSubscribersContainerComponent, LateSubscriberDisplayComponent];
@NgModule({
    declarations: [DECLARATIONS],
    imports: [
        CommonModule
    ],
  exports: [DECLARATIONS]
})
export class LateSubscriberModule {

}
