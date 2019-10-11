import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, AfterContentChecked, AfterViewInit} from '@angular/core';
import {of, ReplaySubject, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'late-subscriber-display',
  template: `
    <h2>Late Subscriber Child</h2>
    <p><b>state$:</b></p>
    <pre>{{state$ | async | json}}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LateSubscriberDisplayComponent {

 
  state$ = new Subject();
  @Input()
  set state(value) {
    this.state$.next({value});
  }

  constructor() {
  }

}
