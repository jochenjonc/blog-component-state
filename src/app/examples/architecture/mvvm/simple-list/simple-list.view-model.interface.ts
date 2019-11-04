import {Observable, Subject} from "rxjs";
import {SimpleListItem, SimpleListModel} from "./simple-list.component.interface";

export type ListViewState = {
    list: SimpleListItem[],
    listClosed: boolean
};
export type SimpleListViewOptions = {
    list: SimpleListItem[],
    listClosed: boolean
};
export interface ISimpleListViewModel {
    list: SimpleListItem[],
    listClosed?: boolean
}
