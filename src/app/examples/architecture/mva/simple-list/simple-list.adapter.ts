import {LocalState} from "@common";
import {SimpleListItem} from "../../interfaces";
import {Store} from "@ngrx/store";
import {fetchRepositoryList, RepositoryListItem, selectGitHubList} from "@data-access/github";
import {map, tap} from "rxjs/operators";
import {Subject} from "rxjs";

export class SimpleListAdapter extends LocalState<{
    list?: SimpleListItem[],
    listExpanded?: boolean
}> {
    // Initial view config
    private initState = {
        listExpanded: false,
        list: []
    };

    refreshRequest = new Subject();
    // State from other sources
    private globalList = this.store.select(selectGitHubList)
        .pipe(map(this.parseListItems));
    private refreshEffect = this.refreshRequest
        .pipe(tap(_ => this.store.dispatch(fetchRepositoryList({})))
        );


    constructor(private store: Store<any>) {
        super();
        this.setSlice(this.initState);
        this.connectSlice(this.globalList
            .pipe(map(list => ({list})))
        );
        this.connectEffect(this.refreshEffect);
    }

    // Map RepositoryListItem to ListItem
    private parseListItems(l: RepositoryListItem[]): SimpleListItem[] {
        return l.map(({id, name}) => ({id, name}))
    }


}
