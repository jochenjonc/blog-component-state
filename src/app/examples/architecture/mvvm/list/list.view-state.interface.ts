import {SimpleListItem} from "../../interfaces";

export interface IListViewState {
    list?: SimpleListItem[],
    selectedItems?: SimpleListItem[],
    listExpanded?: boolean
}
