import {ChangeDetectionStrategy, Component, Output} from '@angular/core';
import {ListModel} from './list.model';
import {Store} from "@ngrx/store";
import {map, tap} from "rxjs/operators";
import {
    fetchRepositoryList, GitHubFeatureState,
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
    selector: 'arc-mvc-list-view',
    templateUrl: './list.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ListModel, ListView, LocalEffects]
})
export class ListMVCComponent {


    state$ = this.m.select();

    @Output()
    selectionChanges: Observable<string[]> = this.m.select()
        .pipe(map(s => s.selectedItems.map(i => i.id)));

    // Component-Level Side-Effects
    constructor(public m: ListModel,
                public v: ListView,
                private store: Store<GitHubFeatureState>) {
        // Connect Model
        this.m.connectState(this.v.listExpandedChanges
            .pipe(map(listExpanded => ({listExpanded}))));
        this.m.connectState(this.v.selectionChanges
            .pipe(
                map(c => c.source.selectedOptions.selected.map(o => o.value)),
                map(selectedItems => ({selectedItems}))
            )
        );
        // Register Side-Effects
        this.m.connectEffect(this.v.refreshClicks
            .pipe(tap(_ => this.store.dispatch(fetchRepositoryList({})))));
    }

}

