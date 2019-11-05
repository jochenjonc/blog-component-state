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

@Component({
    selector: 'arc-mvvm-list-view',
    templateUrl: './list.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ListViewModel]
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
    refreshClickEffect = this.vm.refreshTrigger
        .pipe(tap(_ => this.store.dispatch(fetchRepositoryList({})))
    );

    constructor(public vm: ListViewModel,
                private store: Store<any>,
                private actions$: Actions) {

        // connect ViewModel
        this.vm.connectSlice(this.refreshPending.pipe(map(refreshPending => ({refreshPending}))));
        this.vm.connectSlice(this.globalList.pipe(map(list => ({list}))));
        // register side-effects
        this.vm.connectEffect(this.refreshClickEffect);
    }

    // map RepositoryListItem to ListItem
    parseSimpleListItems(l: RepositoryListItem[]): SimpleListItem[] {
        return l.map(({id, name}) => ({id, name}))
    }

}
