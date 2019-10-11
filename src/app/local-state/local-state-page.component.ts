import {ChangeDetectionStrategy, Component} from '@angular/core';
import {of, interval} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'local-state-page',
  template: `
   <h1>Page</h1>
   <local-state-container 
   [inputValue]="num$ | async"></local-state-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalStatePageComponent {
  num$ = interval(1000);
}
