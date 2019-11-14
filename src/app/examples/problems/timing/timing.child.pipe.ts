import {OnDestroy, OnInit, Pipe, PipeTransform} from '@angular/core';
import {TimingGlobalService} from './timing.global.service';

@Pipe({
    name: 'childPipe'
})
export class TimingChildPipe implements PipeTransform, OnInit, OnDestroy {

    constructor(private globalService: TimingGlobalService) {
        console.log('ChildPipe Constructor');
    }

    transform(value, args?): any {
        console.log('ChildPipe transform', value);
        return value;
    }

    ngOnInit(): void {
        console.log('ChildPipe OnInit');
    }

    ngOnDestroy() {
        console.log('ChildPipe OnDestroy');
    }

}
