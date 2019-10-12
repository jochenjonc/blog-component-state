import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ComponentStateService, selectSlice} from './component-state.service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import { loadList } from './global-state/actions';
import { selectGitHubList } from './global-state/selectors';

@Injectable({
  providedIn: 'root'
})
export class ContainerFacade extends ComponentStateService {

  list$ = this.state$.pipe((selectSlice(s => s.list$)));
  refreshMs$: Observable<number> = this.state$.pipe((selectSlice(s => s.refreshMs$)));

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
