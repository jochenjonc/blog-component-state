import {Subject} from "rxjs";
import {map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {ISimpleListView} from "./simple-list.view.interface";
import {ISimpleListVMState} from "./simple-list.view-model.interface";
import {LowLevelStateService} from "../../state.service";

@Injectable()
export class SimpleListViewModel extends LowLevelStateService<ISimpleListVMState> implements ISimpleListView {
    // Initial view config
    initState: ISimpleListVMState = {
        listExpanded: false,
        list: []
    };

    // IListView =================================================
    refreshClicks  = new Subject<Event>();
    listExpandedChanges  = new Subject<boolean>();

    constructor() {
        super();
        this.connectSlice(this.listExpandedChanges
            .pipe(map(b => ({listExpanded: b})))
        );
        this.setSlice(this.initState);
    }

}


