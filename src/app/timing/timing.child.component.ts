import {ChangeDetectionStrategy, Component,Input, OnChanges, OnInit, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy} from '@angular/core';
import { TimingLocalService } from './timing.local.service';
import {of} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'timing-child',
  template: `
  <p>Child Template Expression: {{templateExpression$ | async | childPipe}}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TimingLocalService]
})
export class TimingChildComponent implements OnChanges, OnInit, AfterContentInit, AfterContentChecked,  AfterViewInit, AfterViewChecked, OnDestroy {

  templateExpression$ = of(null)
    .pipe(tap(_ => console.log('ChildComponent template expression')));

  @Input() set value(v) {
    console.log('ChildComponent Input', v); 
  }

  constructor(private localService: TimingLocalService) {
    console.log('ChildComponent Constructor');
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
