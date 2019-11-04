import {Observable} from "rxjs";
import {RepositoryListItem} from "@data-access/github";
import {SimpleListViewModel} from "./simple-list.view-model";

export interface SimpleListItem {
    id: string;
    name:string;
}

export interface SimpleListModel {
    list: SimpleListItem[],
}

export interface ISimpleListComponent {
    vm: SimpleListViewModel

    // Other sources
    globalList: Observable<SimpleListItem[]>;

    // Component Model
    modelChanges?: Observable<SimpleListModel>

    // Filter / Format / Parse
    parseListItems(l: RepositoryListItem[]): SimpleListItem[]
}

