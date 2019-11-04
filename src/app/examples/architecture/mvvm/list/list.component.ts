import {ChangeDetectionStrategy, Component, Output} from '@angular/core';
import {ListViewModel} from './list.view-model';
import {Store} from "@ngrx/store";
import {map, tap} from "rxjs/operators";
import {fetchRepositoryList, RepositoryListItem, selectGitHubList} from "@data-access/github";
import {SimpleListItem} from "../../interfaces";
import {Observable} from "rxjs";

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

    // Component-Level Side-Effects
    refreshClickEffect = this.vm.refreshClicks
        .pipe(tap(_ => this.store.dispatch(fetchRepositoryList({})))
    );

    constructor(public vm: ListViewModel, private store: Store<any>) {
        // connect ViewModel
        this.vm.connectSlice(this.globalList.pipe(map(list => ({list}))));
        // register side-effects
        this.vm.connectEffect(this.refreshClickEffect);
    }

    // map RepositoryListItem to ListItem
    parseSimpleListItems(l: RepositoryListItem[]): SimpleListItem[] {
        return l.map(({id, name}) => ({id, name}))
    }

}
