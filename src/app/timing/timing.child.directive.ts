import {Directive, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {TimingLocalService} from './timing.local.service';

@Directive({
    selector: '[timing-child-dir]',
    providers: [TimingLocalService]
})
export class TimingChildDirective implements OnChanges, OnInit, OnDestroy {

    constructor(private localService: TimingLocalService) {
        console.log('ChildDirective Constructor');
    }

    @Input() set value(v) {
        console.log('ChildDirective Input', v);
    }

    ngOnChanges(changes) {
        console.log('ChildDirective OnChanges', changes);
    }

    ngOnInit() {
        console.log('ChildDirective ngOnInit');
    }

    ngOnDestroy() {
        console.log('ChildDirective OnDestroy');
    }

}
