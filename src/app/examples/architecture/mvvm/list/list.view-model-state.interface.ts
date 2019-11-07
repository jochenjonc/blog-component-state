import {SimpleListItem} from "../../interfaces";

export interface IListViewModelState {
    list?: SimpleListItem[],
    selectedItems?: SimpleListItem[],
    listExpanded?: boolean;
    refreshInterval?: number;
    refreshPending?: boolean;
}
