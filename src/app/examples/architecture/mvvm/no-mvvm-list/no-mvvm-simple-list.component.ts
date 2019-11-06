import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {map, tap} from "rxjs/operators";
import {fetchRepositoryList, RepositoryListItem, selectGitHubList} from "@data-access/github";
import {SimpleListItem} from "../../interfaces";
import {Subject} from "rxjs";
import {LowLevelStateService} from "../../state.service";
import {ISimpleListVMState} from "../simple-list/simple-list.view-model.interface";
import {LocalState} from "../../../../common/state.service";

@Component({
    selector: 'arc-no-mvvm-simple-list',
    templateUrl: './no-mvvm-simple-list.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: []
})
export class NoMvvmSimpleListComponent extends LocalState<ISimpleListVMState> {
    // View =================================================
    initState = {
        listExpanded: false,
        list: []
    };
    refreshClicks = new Subject<Event>();
    listExpandedChanges = new Subject<boolean>();

    // Component Side-Effects - UI interactions, Background processes
    refreshClickEffect = this.refreshClicks
        .pipe(tap(_ => this.store.dispatch(fetchRepositoryList({}))));

    constructor(private store: Store<any>) {
        super();
        // Component Model - composed out of one or multiple sources
        // State from other sources
        const globalList = this.store.select(selectGitHubList)
            .pipe(map(this.parseListItems));
        this.connectSlice(globalList
            .pipe(map(list => ({list})))
        );
        this.connectSlice(this.listExpandedChanges
            .pipe(map(b => ({listExpanded: b})))
        );
        this.setSlice(this.initState);
        // Register Side-Effects For lifetime of ViewModel
        this.connectEffect(this.refreshClickEffect);
    }

    // Map RepositoryListItem to ListItem
    parseListItems(l: RepositoryListItem[]): SimpleListItem[] {
        return l.map(({id, name}) => ({id, name}))
    }

}
