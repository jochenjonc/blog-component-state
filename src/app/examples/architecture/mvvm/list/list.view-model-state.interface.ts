import {SimpleListItem} from "../../interfaces";

export interface IListViewModelState {
    list?: SimpleListItem[],
    selectedItems?: SimpleListItem[],
    listExpanded?: boolean;
    refreshPeriod?: number;
    refreshPending?: boolean;
}
