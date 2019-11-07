import {Subject} from "rxjs";

export interface ISimpleListView {
    // All UI-Events or component EventBindings
    refreshClicks: Subject<Event>;
    listExpandedChanges: Subject<boolean>
}
