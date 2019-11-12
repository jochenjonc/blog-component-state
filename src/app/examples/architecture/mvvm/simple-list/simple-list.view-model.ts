import {Subject} from "rxjs";
import {map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {ISimpleListView} from "./simple-list.view.interface";
import {ISimpleListVMState} from "./simple-list.view-model.interface";
import {LocalState} from "@common";

@Injectable()
export class SimpleListViewModel extends LocalState<ISimpleListVMState> implements ISimpleListView {
    // Initial view config
    initState: ISimpleListVMState = {
        listExpanded: false,
        list: []
    };

    state$ = this.select();

    // IListView =================================================
    refreshClicks  = new Subject<Event>();
    listExpandedChanges  = new Subject<boolean>();

    constructor() {
        super();
        this.connectState(this.listExpandedChanges
            .pipe(map(b => ({listExpanded: b})))
        );
        this.setState(this.initState);
    }

}


