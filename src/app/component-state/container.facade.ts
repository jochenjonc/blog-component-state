import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {ComponentStateService} from './component-state.service';
import {combineLatest, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {loadList} from './global-state/actions';
import {selectGitHubList} from './global-state/selectors';
import {Item} from "./global-state/item.interface";

export interface ComponentState {
    selectedItemIds?: string[];
    list?: Item[];
    refreshMs?: number;
    // @TODO how to deal with dynamic state structures?
    // [key: string]: any
}

@Injectable({
    providedIn: 'root'
})
export class ContainerFacade extends ComponentStateService {

    // @TODO move default values somewhere else
    list$ = this.select(map((s: ComponentState) => s.list));
    selectedItemIds$ = this.select(map((s: ComponentState) => s.selectedItemIds));
    refreshMs$ = this.select(map((s: ComponentState) => s.refreshMs));

    listConfig$ = combineLatest(this.list$, this.selectedItemIds$)
        .pipe(
            map(([list, selectedItemIds]) => ({list, selectedItemIds}) )
        );

    constructor(private ngRxStore: Store<any>) {
        super();
        this.ngRxStore.select(selectGitHubList).subscribe(console.log);
        this.connectSlices({list: this.ngRxStore.select(selectGitHubList)});
    }

    serverUpdateOn<T>(o: Observable<T>) {
        this.connectEffects({
            loadListEffect: o.pipe(tap(_ => this.ngRxStore.dispatch(loadList({}))))
        });
    }

}
