import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TimingChildComponent} from "./timing.child.component";
import {TimingChildDirective} from "./timing.child.directive";
import {TimingChildPipe} from "./timing.child.pipe";
import {TimingGlobalService} from "./timing.global.service";
import {TimingParentComponent} from "./timing.parent.component";

export const ROUTES = [
    {
        path: '',
        component: TimingParentComponent
    }
];
const DECLARATIONS = [
    TimingParentComponent,
    TimingChildComponent,
    TimingChildDirective,
    TimingChildPipe
];

@NgModule({
    declarations: [DECLARATIONS],
    imports: [
        CommonModule
    ],
    exports: [DECLARATIONS]
})
export class TimingModule {
    constructor(private globalService: TimingGlobalService) {
        console.log('AppModule Constructor');
    }
}
