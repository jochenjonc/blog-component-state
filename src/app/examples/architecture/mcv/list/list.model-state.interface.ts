import {SimpleListItem} from "../../interfaces";

export interface IListModelState {
    list?: SimpleListItem[],
    selectedItems?: SimpleListItem[],
    listExpanded?: boolean;
    refreshInterval?: number;
    refreshPending?: boolean;
}
