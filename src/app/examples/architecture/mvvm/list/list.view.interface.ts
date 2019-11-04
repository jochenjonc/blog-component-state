import {Observable, Observer, Subject, Subscribable} from "rxjs";
import {MatSelectionListChange} from "@angular/material";

export interface IListView {
    // Needed to detect button clicks
    refreshClicks: Subject<Event>;
    // Needed to set selected state
    listExpandedChanges: Subject<boolean>
    // Observe changes to set selected state
    selectionChanges: Observer<MatSelectionListChange>;
    // VM derivations
    selectedOptionsChanges: Observable<{[key: string]: boolean}>;
    // Filter / Parse / Format
    parseSelectedOptions?(l: string[]): {[id: string]: boolean}
}
