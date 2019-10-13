import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {of,from, Subject, timer, ReplaySubject} from 'rxjs';
import {tap, map, switchMap, scan} from 'rxjs/operators';
import { ContainerFacade } from './container.facade';

@Component({
  selector: 'local-state-container',
  template: `
   <h2>Container</h2>
  <local-state-chart [config]="listConfig$ | async"></local-state-chart>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalStateContainerComponent {

  listConfig$ = this.facade.listConfig$;
  
  inputValue$ = new Subject<number>();
  @Input()
  set inputValue(v: number) {
    console.log('InputValue facade', v);
    this.inputValue$.next(v)
  }

  selectedItems$ = new Subject(); 

  constructor(private facade: ContainerFacade) {
    // @TODO use animation frame to stop polling when leaving tab
    this.facade.connectSlices({refreshMs$: this.inputValue$});
    this.facade.connectSlices({selectedItems$: this.selectedItems$});
    this.facade.serverUpdateOn(this.facade.refreshMs$.pipe(switchMap(ms => timer(0, ms || 10000))));
    
  }
  
}
