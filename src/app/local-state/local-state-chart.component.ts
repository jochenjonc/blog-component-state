import {ChangeDetectionStrategy, Component} from '@angular/core';
import {of} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'local-state-chart',
  template: `
   <h3>Display only chart</h3>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalStateChartComponent {

}
