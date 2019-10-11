import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ComponentStateService } from './component-state.service';
import {tap} from 'rxjs/operators';
import { loadList } from './global-state/actions';
import { selectGitHubList } from './global-state/selectors';

@Injectable({
  providedIn: 'root'
})
export class ContainerFacade extends ComponentStateService {

  list$ = this.store.select(selectGitHubList).pipe(tap(console.log));

  constructor(private store: Store<any>) {
    super();
  }

  serverUpdateOn(o) {
    this.connectEffects([
      o.pipe(tap(_ => this.store.dispatch(loadList())))
    ]);
  }

}
