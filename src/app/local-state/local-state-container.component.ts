import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {of,from, Subject, timer} from 'rxjs';
import {tap} from 'rxjs/operators';
import { ContainerFacade } from './container.facade';

@Component({
  selector: 'local-state-container',
  template: `
   <h2>Container</h2>
  inputValue$: {{inputValue$ | async}}<br/>
  <ul>
    <li *ngFor="let i of list$ | async">
      i: {{i | json}}
    </li>
  </ul>
  <local-state-chart></local-state-chart>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalStateContainerComponent {

  list$ = this.facade.list$;

  inputValue$ = new Subject();
  @Input()
  set inputValue(v) {
    this.inputValue$.next(v)
  }

  constructor(private facade: ContainerFacade) {
    // @TODO use animation frame to stop polling when leaving tab
    this.facade.serverUpdateOn(timer(0, 10000));
  }
  
}
