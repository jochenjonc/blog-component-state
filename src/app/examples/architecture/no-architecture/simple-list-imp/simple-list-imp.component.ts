import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {map, tap} from "rxjs/operators";
import {fetchRepositoryList, RepositoryListItem, selectGitHubList} from "@data-access/github";
import {LocalState} from "@common";
import {Subject} from "rxjs";
import {SimpleListItem} from "../../interfaces";
import {MatSelectionListChange} from "@angular/material";

@Component({
    selector: 'arc-no-architecture-imp-simple-list-view',
    templateUrl: './simple-list-imp.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleListNoArchitectureImpComponent {
    // Initial view config
    state = {
        listExpanded: false,
        list: []
    };

    // State from other sources
    private globalList = this.store.select(selectGitHubList)
        .pipe(map(this.parseListItems));

    constructor(private store: Store<any>) {
        this.globalList
            .pipe(tap(list => this.state.list = list))
            .subscribe();
    }

    // IListView =================================================
    onListExpandedChanges(listExpanded: boolean) {
            this.state.listExpanded = listExpanded;
    }
    // Component Side-Effects - UI interactions, Background processes
    onRefreshClickEffect() {
        this.store.dispatch(fetchRepositoryList({}));
    }

    // Map RepositoryListItem to ListItem
    private parseListItems(l: RepositoryListItem[]): SimpleListItem[] {
        return l.map(({id, name}) => ({id, name}))
    }

}
