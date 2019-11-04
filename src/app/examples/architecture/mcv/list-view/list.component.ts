import {ChangeDetectionStrategy, Component} from '@angular/core';
import {merge} from 'rxjs';
import {ListModel} from './list.model';
import {IListComponent, ListConfig} from "./list.component.interface";
import {Store} from "@ngrx/store";
import {map, scan, tap, withLatestFrom} from "rxjs/operators";
import {loadList} from "../../../reactive-component-architecture/global-state/actions";
import {selectGitHubList} from "@data-access/github";

@Component({
    selector: 'arc-mvc-list-view',
    templateUrl: './list.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ListModel]
})
export class ListMVCComponent implements IListComponent {

    gitHubList = this.store.select(selectGitHubList);

    constructor(public m: ListModel,
                private store: Store<any>) {
        merge(
            this.store.select(selectGitHubList)
                .pipe(map(list => ({list}))),
            this.m.selectedItemIdsChanges
                .pipe(map(selectedItemIds => ({selectedItemIds})))
        )
            .pipe(
                scan((s, c) => ({...s, ...c}))
            )
            .subscribe(
                (cfg: ListConfig) => this.m.configObserver.next(cfg)
            );

        this.store.select(selectGitHubList)
            .pipe(
                withLatestFrom(this.m.configObserver),
                tap(([list, config]) =>
                    this.m.configObserver.next({...config, list})
                )
            )
            .subscribe();

        this.m.refreshClicks.pipe(
            tap(() => {
                this.store.dispatch(loadList({}))
            })
        )
            .subscribe();
    }

}
