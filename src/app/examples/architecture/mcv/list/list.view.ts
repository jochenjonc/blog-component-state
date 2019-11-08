import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {IListView} from "./list.view.interface";
import {MatSelectionListChange} from "@angular/material";

@Injectable()
export class ListView implements IListView {
    selectedOptions: import("rxjs").Observable<{ [key: string]: boolean; }>;
    // IListView (events from the view) =================================================
    refreshClicks = new Subject<Event>();
    selectionChanges = new Subject<MatSelectionListChange>();
    listExpandedChanges = new Subject<boolean>();

    selectExpanded(s): boolean {
        return s.listExpanded
    }

    constructor() {
    }

    selectedOptionsMap(s) {
        return s.selectedItems
            .reduce((m, i) => ({...m, [i.id]: true}),
                {} as { [key: string]: boolean })
    }


}
