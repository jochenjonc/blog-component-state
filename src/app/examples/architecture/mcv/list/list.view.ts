import {Observable, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {IListView} from "./list.view.interface";
import {MatSelectionListChange} from "@angular/material";
import {map} from "rxjs/operators";

@Injectable()
export class ListView implements IListView {
    // IListView (events from the view) =================================================
    refreshClicks = new Subject<Event>();
    selectionChanges = new Subject<MatSelectionListChange>();
    listExpandedChanges = new Subject<boolean>();

    constructor() {
    }

}
