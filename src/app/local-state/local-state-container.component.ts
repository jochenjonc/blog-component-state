import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {of,from,interval, Subject, timer, ReplaySubject} from 'rxjs';
import {tap, map, startWith, switchMap, scan} from 'rxjs/operators';
import { ContainerFacade } from './container.facade';

@Component({
  selector: 'local-state-container',
  template: `
   <h2>Container</h2>
  <local-state-chart 
  [config]="listConfig$ | async"
  (selectedItemsChange)="selectedItemsChange$.next($event)"
  ></local-state-chart>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalStateContainerComponent {

  listConfig$ = this.facade.listConfig$;
  
  inputValue$ = new Subject<number>();
  @Input()
  set inputValue(ms: number) {
    if(Number.isInteger(ms)) {
      this.inputValue$.next(ms);
    } else {   
      this.inputValue$.next(10000);
    }
  }

  selectedItemsChange$ = new Subject();
  
  constructor(private facade: ContainerFacade) {
    // @TODO use animation frame to stop polling when leaving tab
    this.facade.connectSlices({refreshMs$: this.inputValue$});
    this.facade.connectSlices({selectedItems$: this.selectedItemsChange$});
    this.facade.serverUpdateOn(this.facade.refreshMs$
      .pipe(switchMap((ms: number) => timer(0, ms))));
  
  }

}