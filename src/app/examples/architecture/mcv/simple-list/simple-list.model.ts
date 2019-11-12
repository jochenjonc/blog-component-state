import {Injectable} from "@angular/core";
import {LocalState} from "@common";
import {ISimpleListModel} from "./simple-list.model.interface";
import {Store} from "@ngrx/store";
import {fetchRepositoryList, RepositoryListItem, selectGitHubList} from "@data-access/github";
import {map, tap} from "rxjs/operators";
import {SimpleListItem} from "../../interfaces";
import {Subject} from "rxjs";

@Injectable()
export class SimpleListModel extends LocalState<ISimpleListModel> {
    // Initial view config
    initState: ISimpleListModel = {
        listExpanded: false,
        list: []
    };
    state$ = this.select();

    refreshRequest = new Subject();

    // Component Side-Effects - UI interactions, Background processes
    refreshEffect = this.refreshRequest
        .pipe(tap(_ => this.store.dispatch(fetchRepositoryList({})))
        );


    constructor(private store: Store<any>) {
        super();
        this.setState(this.initState);

        // State from other sources
        this.connectState(this.store.select(selectGitHubList)
            .pipe(map(this.parseListItems), map(list => ({list})))
        );
        this.connectEffect(this.refreshEffect);

    }

    // Map RepositoryListItem to ListItem
    parseListItems(l: RepositoryListItem[]): SimpleListItem[] {
        return l.map(({id, name}) => ({id, name}))
    }

}


