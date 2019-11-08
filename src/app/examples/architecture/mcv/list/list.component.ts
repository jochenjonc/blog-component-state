import {ChangeDetectionStrategy, Component, Output} from '@angular/core';
import {ListModel} from './list.model';
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
import {ListView} from "./list.view";

@Component({
    selector: 'arc-mvvm-list-view',
    templateUrl: './list.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ListModel, LocalEffects]
})
export class ListMVCComponent {

    @Output()
    selectionChanges: Observable<string[]> = this.m.state$
        .pipe(map(s => s.selectedItems.map(i => i.id)));

    // State from outer sources
    globalList = this.store
        .select(selectGitHubList).pipe(map(this.parseSimpleListItems), tap(l => console.log('list global', l)));
    refreshPending = this.actions$
        .pipe(
            ofType(fetchRepositoryList, repositoryListFetchError, repositoryListFetchSuccess),
            map(a => a.type === fetchRepositoryList.type)
        );


// Component-Level Side-Effects
    refreshTriggerEffect = this.v.refreshClicks
        .pipe(tap(_ => this.store.dispatch(fetchRepositoryList({})))
        );

    constructor(public m: ListModel,
                public v: ListView,
                private store: Store<any>,
                private actions$: Actions) {
        // Connect Model
        this.m.connectSlice(this.refreshPending.pipe(map(refreshPending => ({refreshPending}))));
        this.m.connectSlice(this.globalList.pipe(map(list => ({list}))));
        this.m.connectSlice(this.v.listExpandedChanges
            .pipe(map(listExpanded => ({listExpanded}))));
        this.m.connectSlice(this.v.selectionChanges
            .pipe(
                map(c => c.source.selectedOptions.selected.map(o => o.value)),
                map(selectedItems => ({selectedItems}))
            )
        );
        // Register Side-Effects
        this.m.connectEffect(this.refreshTriggerEffect);
    }

    // map RepositoryListItem to ListItem
    parseSimpleListItems(l: RepositoryListItem[]): SimpleListItem[] {
        return l.map(({id, name}) => ({id, name}))
    }

}
