import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {SimpleListViewModel} from './simple-list.view-model';
import {SimpleListItem} from "./simple-list.component.interface";
import {Store} from "@ngrx/store";
import {map, tap} from "rxjs/operators";
import {fetchRepositoryList, RepositoryListItem, selectGitHubList} from "@data-access/github";

@Component({
    selector: 'arc-mvvm-simple-list-view',
    templateUrl: './simple-list.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleListMVVMComponent implements OnDestroy {
    subscription = new Subscription();
    vm = new SimpleListViewModel();

    // State from other sources
    globalList = this.store.select(selectGitHubList)
        .pipe(map(this.parseListItems));

    // Component Model - composed out of one or multiple sources
    // Component Side-Effects - UI interactions, Background processes
    refreshClickEffect = this.vm.refreshClicks
        .pipe(tap(_ => this.store.dispatch(fetchRepositoryList({})))
    );
    updateVMEffect = this.globalList
        .pipe(
            map(list => ({list})),
            tap(vM => this.vm.viewModelSubject.next(vM))
        );

    constructor(private store: Store<any>) {
        // Connect Model to ViewModel
        this.subscription.add(this.updateVMEffect.subscribe());
        // Register Side-Effects
        this.subscription.add(this.refreshClickEffect.subscribe());
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // Map RepositoryListItem to ListItem
    parseListItems(l: RepositoryListItem[]): SimpleListItem[] {
        return l.map(({id, name}) => ({id, name}))
    }

}
