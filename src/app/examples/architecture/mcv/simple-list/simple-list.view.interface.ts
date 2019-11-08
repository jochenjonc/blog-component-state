import {Observable, Subject} from "rxjs";
import {SimpleListItem} from "../../interfaces";

export interface ISimpleListView {
    // All UI-Events or component EventBindings
    refreshClicks: Subject<Event>;
    listExpandedChanges: Subject<boolean>
}
