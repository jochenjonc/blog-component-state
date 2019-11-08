import {SimpleListItem} from "../../interfaces";
import {RepositoryListItem} from "@data-access/github";

export interface ISimpleListModel {
    globalList?: RepositoryListItem[]
    list?: SimpleListItem[],
    listExpanded?: boolean
}
