import {ChangeDetectionStrategy, Component, Input, Output} from '@angular/core';
import {ListViewModel} from './list.view-model';
import {Store} from "@ngrx/store";
import {endWith, map, scan, startWith, switchMap, switchMapTo, takeUntil, tap, withLatestFrom} from "rxjs/operators";
import {
    fetchRepositoryList,
    repositoryListFetchError,
    repositoryListFetchSuccess,
    RepositoryListItem,
    selectGitHubList
} from "@data-access/github";
import {SimpleListItem} from "../../interfaces";
import {BehaviorSubject, combineLatest, interval, merge, Observable, ReplaySubject, timer} from "rxjs";
import {Actions, ofType} from "@ngrx/effects";


@Component({
    selector: 'arc-mvvm-list-view',
    templateUrl: './list.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ListViewModel]
})
export class ListMVVMComponent {

    defaultRefreshDuration = 1000 * 10;
    refreshDurationChange = new BehaviorSubject(this.defaultRefreshDuration);
    @Input()
    set refreshDuration(interval: number) {
        if(interval) {
            this.refreshDurationChange.next(interval)
        }
    }

    @Output()
    selectionChanges: Observable<string[]> = this.vm.state$
        .pipe(map(s => s.selectedItems.map(i => i.id)));

    // State from outer sources
    private globalList = this.store
         .select(selectGitHubList).pipe(map(this.parseSimpleListItems), tap(l =>  console.log('list global', l)));
    private refreshPending = this.actions$
        .pipe(
            ofType(fetchRepositoryList, repositoryListFetchError,repositoryListFetchSuccess),
            map(a => a.type === fetchRepositoryList.type)
        );

    // Component-Level Side-Effects
    private refreshTriggerEffect = this.vm.refreshTrigger
        .pipe(tap(_ => this.store.dispatch(fetchRepositoryList({})))
    );

    constructor(public vm: ListViewModel,
                private store: Store<any>,
                private actions$: Actions) {

        // connect ViewModel
        this.vm.connectSlice(this.refreshPending.pipe(map(refreshPending => ({refreshPending}))));
        this.vm.connectSlice(this.globalList.pipe(map(list => ({list}))));
        // register side-effects
        this.vm.connectEffect(this.refreshTriggerEffect);
    }

    // map RepositoryListItem to ListItem
    private parseSimpleListItems(l: RepositoryListItem[]): SimpleListItem[] {
        return l.map(({id, name}) => ({id, name}))
    }

}
