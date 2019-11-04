import {ChangeDetectionStrategy, Component, Input, OnDestroy, Output} from '@angular/core';
import {merge, Subject, Subscription} from 'rxjs';
import {ListViewModel} from './list.view-model';
import {IListComponent, ListConfig, ListItem} from "./list.component.interface";
import {Store} from "@ngrx/store";
import {map, scan, tap} from "rxjs/operators";
import {fetchRepositoryList, RepositoryListItem, selectGitHubList} from "@data-access/github";

@Component({
    selector: 'arc-mvvm-list-view',
    templateUrl: './list.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ListViewModel]
})
export class ListMVVMComponent implements IListComponent, OnDestroy {
    subscription = new Subscription();

    configInputObserver = new Subject<ListConfig>();
    @Input()
    set config(c: ListConfig) {
        this.configInputObserver.next(c);
    };
    @Output()
    readonly selectedItemIdsChanges = this.vm.selectedItemIdsChanges;

    // State from outer sources
    globalList = this.store;
        // .select(selectGitHubList).pipe(map(this.parseListItems), tap(l =>  console.log('list global', l)));

    // ViewModelInputs
    configChanges = merge(
        // Shape: {list: []}
        this.globalList
            .pipe(map(list => ({list}))),
        // Shape: {list: [], selectedItemIds: []}
        this.configInputObserver,
        // Shape: {selectedItemIds: []}
        this.vm.selectedItemIdsChanges
            .pipe(map(selectedItemIds => ({selectedItemIds})))
    )
        .pipe(
            tap(console.log),
            scan((s, c) => ({...s, ...c }),
                {list: [], selectedItemIds: []})
        );

    // Component-Level Side-Effects
    refreshClickEffect = this.vm.refreshClicks
        .pipe(tap(_ => this.store.dispatch(fetchRepositoryList({})))
    );

    constructor(public vm: ListViewModel, private store: Store<any>) {
        this.globalList
            .pipe(map(list => ({list}))).subscribe(console.log)
        // connect ViewModel
        this.vm.configObserver = this.configChanges;
        // register side-effects
        this.subscription.add(this.refreshClickEffect.subscribe());
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }


    // map RepositoryListItem to ListItem
    parseListItems(l: RepositoryListItem[]): ListItem[] {
        return l.map(({id, name}) => ({id, name}))
    }

}
