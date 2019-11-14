import {map, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {SimpleListModel} from "./simple-list.model";
import {ISimpleListView} from "./simple-list.view.interface";
import {Injectable} from "@angular/core";

@Injectable()
export class SimpleListAdapter implements ISimpleListView {
    list$ = this.m.select(map(s => s.list));
    listExpanded$ = this.m.select(map(s => s.listExpanded));
    listExpandedChanges = new Subject<boolean>();
    refreshClicks = new Subject<Event>();

    constructor(private m: SimpleListModel) {
        this.refreshClicks
            .subscribe(_ => {
                console.log('S');
                this.m.refreshMeetingEvent.next(_);
            });
    }

}
