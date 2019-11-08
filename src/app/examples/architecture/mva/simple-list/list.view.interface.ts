import {Observable, Observer, Subject, Subscribable} from "rxjs";
import {MatSelectionListChange} from "@angular/material";

export interface IListView {
    // refreshCountDown: Observable<number>;
    // Needed to detect button clicks
    refreshClicks: Subject<Event>;
    // Needed to set selected state
    listExpandedChanges: Subject<boolean>
    // Observe changes to set selected state
}
