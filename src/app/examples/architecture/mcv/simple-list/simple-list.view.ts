import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {ISimpleListView} from "./simple-list.view.interface";

@Injectable()
export class SimpleListView implements ISimpleListView {
    // ISimpleListView =================================================
    refreshClicks = new Subject<Event>();
    listExpandedChanges = new Subject<boolean>();

    constructor() {

    }

}


