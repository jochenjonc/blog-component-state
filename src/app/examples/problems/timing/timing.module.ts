import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TimingChildComponent} from "./timing.child.component";
import {TimingChildDirective} from "./timing.child.directive";
import {TimingChildPipe} from "./timing.child.pipe";
import {TimingGlobalService} from "./timing.global.service";
import {TimingParentComponent} from "./timing.parent.component";
import {LoggerService} from "@common";
import {MatListModule} from "@angular/material";

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
        CommonModule,
        MatListModule
    ],
    exports: [DECLARATIONS]
})
export class TimingModule {
    constructor(private globalService: TimingGlobalService, private logger: LoggerService) {
    this.logger.log({creator: 'module', msg: 'AppModule Constructor', hook: 'constructor', creatorInstance: 'TimingModule'});
    }
}
