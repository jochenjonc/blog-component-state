import {ChangeDetectionStrategy, Component, OnChanges, OnInit, AfterContentChecked, AfterViewInit} from '@angular/core';
import {of} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'late-subscribers-container',
  template: `
    <p><b>state$:</b></p>
    <pre>{{num$ | async | json}}</pre>
    <late-subscriber-display [state]="num$ | async">
    </late-subscriber-display>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateSubscribersContainerComponent {
  num$ = of(1);

  constructor() {
    console.log('Container Constructor')
  }

}
