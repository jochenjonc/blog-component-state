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
        .pipe(tap(_ => console.log('ChildComponent templateExpression')));

    constructor(private localService: TimingLocalService) {
        console.log('ChildComponent Constructor');
    }

    @Input() set value(v) {
        console.log('ChildComponent Input', v);
    }

    ngOnChanges(changes) {
        console.log('ChildComponent OnChanges', changes);
    }

    ngOnInit() {
        console.log('ChildComponent ngOnInit');
    }

    ngAfterContentInit() {
        console.log('ChildComponent AfterContentInit');
    }

    ngAfterContentChecked() {
        console.log('ChildComponent AfterContentChecked');
    }

    ngAfterViewInit() {
        console.log('ChildComponent AfterViewInit');
    }

    ngAfterViewChecked() {
        console.log('ChildComponent AfterViewChecked');
    }

    ngOnDestroy() {
        console.log('ChildComponent OnDestroy');
    }

}
