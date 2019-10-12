import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {of,from, Subject, timer} from 'rxjs';
import {tap, switchMap} from 'rxjs/operators';
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

  inputValue$ = new Subject<number>();
  @Input()
  set inputValue(v: number) {
    this.inputValue$.next(v)
  }

  constructor(private facade: ContainerFacade) {
    // @TODO use animation frame to stop polling when leaving tab
    this.facade.connectSlices({refreshMs$: this.inputValue$});
    this.facade.serverUpdateOn(this.facade.refreshMs$.pipe(switchMap(ms => timer(0, ms || 10000))));
  }
  
}
