import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {IListView} from "./list.view.interface";

@Injectable()
export class ListView implements IListView {
    // IListView (events from the view) =================================================
    refreshClicks = new Subject<Event>();
    listExpandedChanges = new Subject<boolean>();

    constructor() {
    }

}
