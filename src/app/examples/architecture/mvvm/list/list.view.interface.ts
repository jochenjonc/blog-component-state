import {Observer, Subscribable} from "rxjs";
import {MatSelectionListChange} from "@angular/material";

export interface IListView {
    // Needed to detect button clicks
    refreshClicks: Observer<Event>;
    // Needed to set selected state
    selectedOptionsChanges: Subscribable<{[key: string]: boolean}>;
    // Observe changes to set selected state
    selectionChangeObserver: Observer<MatSelectionListChange>;
    // Filter / Parse / Format
    parseSelectedOptions?(l: string[]): {[id: string]: boolean}
}
