import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {listLoadedError, listLoadedSuccess, loadList} from './actions';

import {GitHubService} from '../../github.service';
import {of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GlobalEffects {

    loadList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadList.type),
            switchMap(action =>
              this.gitHubService.getData(action).pipe(
                    map(list => listLoadedSuccess({list})),
                    catchError(error => of(listLoadedError({error})))
               )
            )
        )
    );

    constructor(private actions$: Actions, private gitHubService: GitHubService) {

    }

}
