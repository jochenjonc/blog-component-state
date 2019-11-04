import {defer, Observable, Subject} from "rxjs";
import {filter, map, startWith} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {MatSelectionListChange} from "@angular/material";
import {IListView} from "./list.view.interface";
import {IListModel} from "./list.model.interface";
import {ListConfig, selectedIds} from "./list.component.interface";

@Injectable()
export class ListViewModel implements IListModel, IListView {
    // IListViewModel ============================================

    // Initial view config
    initialListConfig = {list: [], selectedItemIds: []};
    // Data from component class
    configObserver: Observable<ListConfig>;
    // Sending first value and filtering out bad values
    configChanges = defer(() => this.configObserver
        .pipe(
            filter<ListConfig>(this.isListConfig)
        )
    );

    // IListView =================================================

    // Listener for button click events
    refreshClicks  = new Subject<Event>();

    // Listener for list selectionChange events
    selectionChangeObserver = new Subject<MatSelectionListChange>();
    // Send command to component class
    selectedItemIdsChanges = this.selectionChangeObserver.pipe(
        map(this.parseSelectedIds)
    );
    // Derive IdMap of selected items to set selection in view (shortcut in the view)
    selectedOptionsChanges = this.configChanges
        .pipe(
            map(c => c.selectedItemIds),
            map(this.parseSelectedOptions)
        );

    constructor() {

    }
    //  Formatting (model to other shape) =========================================
    // Parsing (other shape to model shape)========================================
    // Filter =====================================================================
    parseSelectedIds(change: MatSelectionListChange): selectedIds {
        return change.source.selectedOptions.selected
            .map(option => option.value.id);
    }

    isListConfig(cfg: ListConfig | any): boolean {
        const isArray = (obj) => (Object.prototype.toString.call(obj) === "[object Array]");
        return (cfg &&
            'list' in cfg && isArray(cfg.list) &&
            'selectedItemIds' in cfg && isArray(cfg.selectedItemIds));
    }

    parseSelectedOptions(ids: selectedIds): {[id: string]: boolean} {
        return ids
            .reduce((m, i)=> ({...m, [i]: true}), {});
    }

}


