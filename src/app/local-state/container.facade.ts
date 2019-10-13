import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {ComponentStateService} from './component-state.service';
import {combineLatest, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {loadList} from './global-state/actions';
import {selectGitHubList} from './global-state/selectors';

@Injectable({
    providedIn: 'root'
})
export class ContainerFacade extends ComponentStateService {

    // @TODO move default values somewhere else
    list$ = this.select(map((s: any) => s.list$ || []));
    selectedItems$ = this.select(map((s: any) => s.selectedItems$ || []));
    refreshMs$: Observable<number> = this.select(map((s: any) => s.refreshMs$));

    listConfig$ = combineLatest(this.list$, this.selectedItems$).pipe(
        map(([list, selectedItems]) => ({list, selectedItems}))
    );

    constructor(private ngRxStore: Store<any>) {
        super();
        this.connectSlices({list$: this.ngRxStore.select(selectGitHubList)});
    }

    serverUpdateOn(o) {
        this.connectEffects([
            o.pipe(tap(_ => this.ngRxStore.dispatch(loadList())))
        ]);
    }

}
