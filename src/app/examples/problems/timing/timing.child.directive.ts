import {Directive, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {TimingLocalService} from "./timing.local.service";
import {LoggerService} from "@common";

@Directive({
    selector: '[timing-child-dir]'
})
export class TimingChildDirective implements OnChanges, OnInit, OnDestroy {

    constructor(private logger: LoggerService) {
        this.logger.log({creator: 'directive', msg: 'ChildDirective Constructor'});
    }

    @Input() set value(v) {
        this.logger.log({msg: 'ChildDirective Input', data: v, creator: 'directive'});
    }

    ngOnChanges(changes) {
        this.logger.log({msg: 'ChildDirective OnChanges', data: changes, creator: 'directive'});
    }

    ngOnInit() {
        this.logger.log({creator: 'directive', msg: 'ChildDirective ngOnInit'});
    }

    ngOnDestroy() {
        this.logger.log({creator: 'directive', msg: 'ChildDirective OnDestroy'});
    }

}
