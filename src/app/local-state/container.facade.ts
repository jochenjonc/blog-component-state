import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ComponentStateService, selectSlice} from './component-state.service';
import {Observable, combineLatest} from 'rxjs';
import {tap, map} from 'rxjs/operators';
import { loadList } from './global-state/actions';
import { selectGitHubList } from './global-state/selectors';

@Injectable({
  providedIn: 'root'
})
export class ContainerFacade extends ComponentStateService {

  list$ = this.state$.pipe((selectSlice(s => s.list$)));
  selectedItems$ = this.state$.pipe((selectSlice(s => s.selectedItems$)));
  refreshMs$: Observable<number> = this.state$.pipe((selectSlice(s => s.refreshMs$)));

  listConfig$ = combineLatest( this.list$, this.selectedItems$).pipe( 
    map(([list, selectedItems]) => ({ list, selectedItems }) )
  );

  constructor(private ngRxStore: Store<any>) {
    super();
    this.refreshMs$.subscribe({next(n) {console.log('FAC CTOR', v); }})

    this.connectSlices({list$: this.ngRxStore.select(selectGitHubList)});
  }

  serverUpdateOn(o) {
    this.connectEffects([
      o.pipe(tap(_ => this.ngRxStore.dispatch(loadList())))
    ]);
  }

}
