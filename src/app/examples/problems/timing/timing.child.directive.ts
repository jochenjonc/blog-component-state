import {Directive, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';

@Directive({
    selector: '[timing-child-dir]'
})
export class TimingChildDirective implements OnChanges, OnInit, OnDestroy {

    constructor() {
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
