import {ChangeDetectionStrategy, Component, OnChanges, OnInit, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy} from '@angular/core';
import {of} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'timing-parent',
  template: `
   <p>Parent Template Expression: {{templateExpression$ | async}}</p>
    <timing-child 
      [value]="templateBinding$ | async"
       timing-child-dir
    >
    </timing-child>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimingParentComponent implements OnChanges, OnInit, AfterContentInit, AfterContentChecked,  AfterViewInit, AfterViewChecked, OnDestroy {

  templateExpression$ = of('expresoin').pipe(tap(_ => console.log('ParentComponent template expression')));

  templateBinding$ = of('binding').pipe(tap(_ => console.log('ParentComponent template binding')));

  constructor() {
    console.log('ParentComponent Constructor');
  }

  ngOnChanges(changes) {
    console.log('ParentComponent OnChanges', changes);
  }

  ngOnInit() {
    console.log('ParentComponent ngOnInit');
  }

  ngAfterContentInit() {
    console.log('ParentComponent AfterContentInit');
  }

  ngAfterContentChecked() {
    console.log('ParentComponent AfterContentChecked');
  }

  ngAfterViewInit() {
    console.log('ParentComponent AfterViewInit');
  }

  ngAfterViewChecked() {
    console.log('ParentComponent AfterViewChecked');
  }

  ngOnDestroy() {
    console.log('ParentComponent OnDestroy');
  }

}
