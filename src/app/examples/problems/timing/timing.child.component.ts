import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit
} from '@angular/core';
import {TimingLocalService} from './timing.local.service';
import {of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {LoggerService} from "@common";

@Component({
    selector: 'timing-child',
    template: `
    <p>Child Template Expression: {{templateExpression$ | async | childPipe}}</p>
        <input [value]="'templateBinding' | childPipe">
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TimingLocalService]
})
export class TimingChildComponent implements OnChanges, OnInit, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {

    templateExpression$ = of('templateExpression')
        .pipe(tap(_ => this.logger.log('ChildComponent templateExpression')));

    constructor(private localService: TimingLocalService, private logger: LoggerService) {
        this.logger.log({creator: 'component', msg: 'ChildComponent Constructor'});
    }

    @Input() set value(v) {
        this.logger.log({msg: 'ChildComponent Input',data: v, creator: 'component'});
    }

    ngOnChanges(changes) {
        this.logger.log({msg: 'ChildComponent OnChanges', data: changes, creator: 'component'});
    }

    ngOnInit() {
        this.logger.log({creator: 'component', msg: 'ChildComponent ngOnInit'});
    }

    ngAfterContentInit() {
        this.logger.log({creator: 'component', msg: 'ChildComponent AfterContentInit'});
    }

    ngAfterContentChecked() {
        this.logger.log({creator: 'component', msg: 'ChildComponent AfterContentChecked'});
    }

    ngAfterViewInit() {
        this.logger.log({creator: 'component', msg: 'ChildComponent AfterViewInit'});
    }

    ngAfterViewChecked() {
        this.logger.log({creator: 'component', msg: 'ChildComponent AfterViewChecked'});
    }

    ngOnDestroy() {
        this.logger.log({creator: 'component', msg: 'ChildComponent OnDestroy'});
    }

}
