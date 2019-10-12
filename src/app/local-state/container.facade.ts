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
    map(([list, selectedItems]) => { console.log(list, selectedItems); return ({ list, selectedItems }) })
  );

  constructor(private store: Store<any>) {
    super();

    this.connectSlices({list$: this.store.select(selectGitHubList)});
  }

  serverUpdateOn(o) {
    this.connectEffects([
      o.pipe(tap(_ => this.store.dispatch(loadList())))
    ]);
  }

}
