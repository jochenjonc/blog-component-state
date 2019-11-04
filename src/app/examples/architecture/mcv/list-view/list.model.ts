import {Injectable} from "@angular/core";
import {IListView} from "./list.view.interface";
import {Observable, ReplaySubject, Subject} from "rxjs";
import {MatSelectionListChange} from "@angular/material";
import {IListModel} from "./list.model.interface";
import {ListConfig, selectedIds} from "./list.component.interface";
import {filter, map, startWith} from "rxjs/operators";

@Injectable()
export class ListModel implements IListModel, IListView {
    initialListConfig: ListConfig = {
        list: [],
        selectedItemIds: []
    };
    configObserver = new ReplaySubject<ListConfig>(1);
    configChanges: Observable<ListConfig> = this.configObserver
        .pipe(
            filter(this.isListConfig),
            startWith(this.initialListConfig)
        );

    refreshClicks = new Subject<Event>();

    selectedOptionsChanges = this.configChanges
        .pipe(
            map(c => this.parseSelectedOptions(c.selectedItemIds))
        );
    selectionChangeObserver = new Subject<MatSelectionListChange>();
    selectedItemIdsChanges = this.selectionChangeObserver
        .pipe(
            map(this.parseSelectedIds)
        );

    // Formatting (model to other shape) =========================================
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
