import {Observable, Subject} from "rxjs";
import {MatSelectionListChange} from "@angular/material";

export interface IListView {
    // Needed to detect button clicks
    refreshClicks: Subject<Event>;
    // Needed to set selected state
    selectedOptionsChanges: Observable<{[key: string]: boolean}>;
    // Observe changes to set selected state
    selectionChangeObserver: Subject<MatSelectionListChange>;
    // Filter / Parse / Format
    parseSelectedOptions?(l: string[]): {[id: string]: boolean}
}
