import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SimpleListViewModel} from './simple-list.view-model';
import {Store} from "@ngrx/store";
import {map, tap} from "rxjs/operators";
import {fetchRepositoryList, RepositoryListItem, selectGitHubList} from "@data-access/github";
import {SimpleListItem} from "../../interfaces";

@Component({
    selector: 'arc-mvvm-simple-list-view',
    templateUrl: './simple-list.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SimpleListViewModel]
})
export class SimpleListMVVMComponent {
    // State from other sources
    globalList = this.store.select(selectGitHubList)
        .pipe(map(this.parseListItems));

    // Component Side-Effects - UI interactions, Background processes
    refreshClickEffect = this.vm.refreshClicks
        .pipe(tap(_ => this.store.dispatch(fetchRepositoryList({})))
        );

    constructor(public vm: SimpleListViewModel,
                private store: Store<any>) {
        // Component Model - composed out of one or multiple sources
        this.vm.connectSlice(this.globalList
            .pipe(map(list => ({list})))
        );

        // Register Side-Effects For lifetime of ViewModel
        this.vm.connectEffect(this.refreshClickEffect);
    }

    // Map RepositoryListItem to ListItem
    parseListItems(l: RepositoryListItem[]): SimpleListItem[] {
        return l.map(({id, name}) => ({id, name}))
    }

}
