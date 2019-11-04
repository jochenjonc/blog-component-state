import {ListConfig} from "./list.component.interface";
import {Observable, Subject} from "rxjs";
import {selectedIds} from "../../mvvm/list/list.component.interface";

export interface IListModel {
    // Needed to receive model updates and init defaults
    initialListConfig: ListConfig;
    configObserver: Subject<ListConfig>;
    configChanges: Observable<ListConfig>;
    // Needed to send commands to the model
    selectedItemIdsChanges: Observable<selectedIds>;
    // Filter / Parse / Format
    parseSelectedIds?(MatSelectionListChange): selectedIds;
    isListConfig?(c: any): boolean
}
