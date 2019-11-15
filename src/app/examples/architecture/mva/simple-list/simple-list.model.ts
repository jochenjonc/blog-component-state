import {Subject} from "rxjs";
import {map, tap} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {LocalState} from '@common';
import {fetchRepositoryList, RepositoryListItem, selectGitHubList} from "@data-access/github";
import {Store} from "@ngrx/store";
import {SimpleListItem} from "../../interfaces";

@Injectable()
export class SimpleListModel extends LocalState<{
    list?: SimpleListItem[],
    listExpanded?: boolean
}> {
    // Initial view config
    private initState: any = {
        listExpanded: true,
        list: [],
    };
    // State from outer sources
    globalList = this.store.select(selectGitHubList)
        .pipe(map(this.parseSimpleListItems));

    refreshMeetingEvent = new Subject();

    constructor(private store: Store<any>) {
        super();
        this.setState(this.initState);
        this.connectState(this.globalList.pipe(map(list => ({list}))));
        this.connectEffect(this.refreshMeetingEvent.pipe(
            tap(_ => console.log(' console.log(\'S\');')),
            tap(_ => this.store.dispatch(fetchRepositoryList))
        ))
    }

    // map RepositoryListItem to ListItem
    parseSimpleListItems(l: RepositoryListItem[]): SimpleListItem[] {
        return l.map(({id, name}) => ({id, name}))
    }

}

