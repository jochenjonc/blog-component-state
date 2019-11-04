import {createSelector} from '@ngrx/store';
import {ListContainerState} from "./list.container.adapter.interface";
import {ListConfig} from "../../components/list/list-config.interface";

export const selectList = (state: ListContainerState)  => state.list;
export const selectSelectedItemIds = (state: ListContainerState) => state.selectedItemIds;
export const selectRefreshMs = (state: ListContainerState) => state.refreshMs;

export const selectListConfig = createSelector(
    selectList,
    selectSelectedItemIds,
    (list, selectedItemIds): ListConfig => ({list, selectedItemIds})
);

