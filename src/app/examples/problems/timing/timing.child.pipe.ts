import {OnDestroy, OnInit, Pipe, PipeTransform} from '@angular/core';
import {TimingGlobalService} from './timing.global.service';
import {LoggerService} from "@common";

@Pipe({
    name: 'childPipe'
})
export class TimingChildPipe implements PipeTransform, OnInit, OnDestroy {

    constructor(private globalService: TimingGlobalService, private logger: LoggerService) {
        this.logger.log({creator: 'pipe', msg: 'ChildPipe Constructor'});
    }

    transform(value, args?): any {
        this.logger.log({msg: 'ChildPipe transform',data: value, creator: 'pipe'});
        return value;
    }

    ngOnInit(): void {
        this.logger.log({creator: 'pipe', msg: 'ChildPipe OnInit'});
    }

    ngOnDestroy() {
        this.logger.log({creator: 'pipe', msg: 'ChildPipe OnDestroy'});
    }

}
