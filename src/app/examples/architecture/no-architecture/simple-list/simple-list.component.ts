import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {map, tap} from "rxjs/operators";
import {fetchRepositoryList, RepositoryListItem, selectGitHubList} from "@data-access/github";
import {LocalState} from "@common";
import {Subject} from "rxjs";
import {SimpleListItem} from "../../interfaces";

@Component({
    selector: 'arc-no-architecture-simple-list-view',
    templateUrl: './simple-list.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleListNoArchitectureComponent
    extends LocalState<{
    list?: SimpleListItem[],
    listExpanded?: boolean
}> {
    // Initial view config
    initState = {
        listExpanded: false,
        list: []
    };

    state$ = this.select();

    // IListView =================================================
    refreshClicks = new Subject<Event>();
    listExpandedChanges = new Subject<boolean>();

    // State from other sources
    globalList = this.store.select(selectGitHubList)
        .pipe(map(this.parseListItems));

    // Component Side-Effects - UI interactions, Background processes
    refreshClickEffect = this.refreshClicks
        .pipe(tap(_ => this.store.dispatch(fetchRepositoryList({})))
        );

    constructor(private store: Store<any>) {
        super();
        this.setState(this.initState);

        this.connectState(this.listExpandedChanges
            .pipe(map(b => ({listExpanded: b})))
        );
        this.connectState(this.globalList
            .pipe(map(list => ({list})))
        );

        // Register Side-Effects For lifetime of ViewModel
        this.connectEffect(this.refreshClickEffect);
    }

    // Map RepositoryListItem to ListItem
    parseListItems(l: RepositoryListItem[]): SimpleListItem[] {
        return l.map(({id, name}) => ({id, name}))
    }

}
