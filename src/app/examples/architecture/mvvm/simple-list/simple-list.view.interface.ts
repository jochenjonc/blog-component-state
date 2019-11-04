import {Observer} from "rxjs";

export interface ISimpleListView {
    // Needed to detect button clicks
    refreshClicks: Observer<Event>;
}
