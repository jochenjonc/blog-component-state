import {Observable, Subscribable} from "rxjs";
import {RepositoryListItem} from "@data-access/github";

export type selectedIds = string[];

export interface ListItem {
    id: string;
    name:string;
}

export interface ListConfig {
    list: ListItem[],
    selectedItemIds: selectedIds
}

export interface IListComponent {
    // @Input bindings
    config: ListConfig;
    configInputObserver: Observable<ListConfig>;
    // @Output bindings
    selectedItemIdsChanges: Subscribable<string[]>;

    //
    globalList: Observable<ListItem[]>;
    configChanges: Observable<ListConfig>

    // Filter / Format / Parse
    parseListItems(l: RepositoryListItem[]): ListItem[]
}

