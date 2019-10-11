
import { Injectable, OnDestroy, Optional } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { loadList, listLoadedError, listLoadedSuccess } from './actions';

import { GitHubService } from '../../github.service';
import {interval, of, merge, Observable, Subject} from 'rxjs';
import {switchMap, map, catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalEffects {

loadList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadList),
      switchMap(action =>
        this.gitHubService.getData(action).pipe(
          map(list => listLoadedSuccess({list}) ),
          catchError(error => of(listLoadedError({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private gitHubService: GitHubService) {

  }

}