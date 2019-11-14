import {Observable, Subject} from "rxjs";
import {SimpleListItem} from "../../interfaces";

export interface ISimpleListView {
    // refreshCountDown: Observable<number>;
    // Needed to detect button clicks
    refreshClicks: Subject<Event>;
    // Needed to set selected state
    listExpandedChanges: Subject<boolean>
    // Rendered List items
    list$: Observable<SimpleListItem[]>;
    listExpanded$: Observable<boolean>;
}
