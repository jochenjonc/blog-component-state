import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {IListModelState} from "./list.model-state.interface";
import {LocalState} from '@common';
import {
    fetchRepositoryList,
    repositoryListFetchError,
    repositoryListFetchSuccess,
    RepositoryListItem,
    selectGitHubList
} from "@data-access/github";
import {Actions, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {SimpleListItem} from "../../interfaces";

@Injectable()
export class ListModel extends LocalState<IListModelState> {

    // Initial view config
    private initState: IListModelState = {
        listExpanded: true,
        list: [],
        selectedItems: [],
        refreshInterval: 10000,
        refreshPending: false
    };
    // State from outer sources
    globalList = this.store.select(selectGitHubList)
        .pipe(map(this.parseSimpleListItems));
    refreshPending = this.actions$
        .pipe(
            ofType(fetchRepositoryList, repositoryListFetchError, repositoryListFetchSuccess),
            map(a => a.type === fetchRepositoryList.type)
        );

    selectedOptions: Observable<{ [key: string]: boolean; }> = this.state$
        .pipe(
            map(s => s.selectedItems
                .reduce((m, i) => ({...m, [i.id]: true}),
                    {} as { [key: string]: boolean })
            )
        );

    constructor(  private store: Store<any>,
                  private actions$: Actions) {
        super();
        this.setSlice(this.initState);
        this.connectSlice(this.refreshPending.pipe(map(refreshPending => ({refreshPending}))));
        this.connectSlice(this.globalList.pipe(map(list => ({list}))));
    }

    // map RepositoryListItem to ListItem
    parseSimpleListItems(l: RepositoryListItem[]): SimpleListItem[] {
        return l.map(({id, name}) => ({id, name}))
    }

}

