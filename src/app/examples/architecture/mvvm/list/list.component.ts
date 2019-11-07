import {ChangeDetectionStrategy, Component, Output} from '@angular/core';
import {ListViewModel} from './list.view-model';
import {Store} from "@ngrx/store";
import {map, tap} from "rxjs/operators";
import {
    fetchRepositoryList,
    repositoryListFetchError,
    repositoryListFetchSuccess,
    RepositoryListItem,
    selectGitHubList
} from "@data-access/github";
import {SimpleListItem} from "../../interfaces";
import {Observable} from "rxjs";
import {Actions, ofType} from "@ngrx/effects";
import {LocalEffects} from "@common";

@Component({
    selector: 'arc-mvvm-list-view',
    templateUrl: './list.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ListViewModel, LocalEffects]
})
export class ListMVVMComponent {

    @Output()
    selectionChanges: Observable<string[]> = this.vm.state$
        .pipe(map(s => s.selectedItems.map(i => i.id)));

    // State from outer sources
    globalList = this.store
         .select(selectGitHubList).pipe(map(this.parseSimpleListItems), tap(l =>  console.log('list global', l)));
    refreshPending = this.actions$
        .pipe(
            ofType(fetchRepositoryList, repositoryListFetchError,repositoryListFetchSuccess),
            map(a => a.type === fetchRepositoryList.type)
        );

    // Component-Level Side-Effects
    refreshTriggerEffect = this.vm.refreshTrigger
        .pipe(tap(_ => this.store.dispatch(fetchRepositoryList({})))
    );

    constructor(public vm: ListViewModel,
                public ef: LocalEffects,
                private store: Store<any>,
                private actions$: Actions) {

        // connect ViewModel
        this.vm.connectSlice(this.refreshPending.pipe(map(refreshPending => ({refreshPending}))));
        this.vm.connectSlice(this.globalList.pipe(map(list => ({list}))));
        // register side-effects
        this.ef.connectEffect(this.refreshTriggerEffect);
    }

    // map RepositoryListItem to ListItem
    parseSimpleListItems(l: RepositoryListItem[]): SimpleListItem[] {
        return l.map(({id, name}) => ({id, name}))
    }

}
