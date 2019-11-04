import {RepositoryListItemModel} from "@data-access/github";

export interface ListContainerAdapter {

}
export interface ListContainerState {
    list: RepositoryListItemModel[];
    selectedItemIds: string[];
    refreshMs: number;
    // @TODO how to deal with dynamic state structures?
    // [key: string]: any
}


