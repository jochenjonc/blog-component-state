import {ChangeDetectionStrategy, Input, Component} from '@angular/core';
import {Subject} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'local-state-chart',
  template: `
   <h3>Display only chart</h3>
   <ul>
    <li *ngFor="let i of list$ | async">
     {{i.id}}:{{i.name}}
    </li>
   </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalStateChartComponent {
  list$ = new Subject<any[]>();
  @Input()
  set list(l) {
    this.list$.next(l);
  }
}
