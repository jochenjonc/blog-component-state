import {Subject} from "rxjs";
import {map, tap} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {LowLevelStateService} from "../../state.service";
import {IListViewState} from "./list.view-state.interface";
import {IListView} from "./list.view.interface";
import {MatSelectionListChange} from "@angular/material";

@Injectable()
export class ListViewModel extends LowLevelStateService<IListViewState> implements IListView {
    // Initial view config
    private initState: IListViewState = {
        listExpanded: true,
        list: [],
        selectedItems: []
    };

    // IListView =================================================
    selectedOptionsChanges = this.state$
        .pipe(
            map(s => s.selectedItems
                .reduce((m, i) => ({...m, [i.id]: true}),
                    {} as { [key: string]: boolean })
            )
        );
    refreshClicks = new Subject<Event>();
    selectionChanges = new Subject<MatSelectionListChange>();
    listExpandedChanges = new Subject<boolean>();

    constructor() {
        super();
        this.setSlice(this.initState);


        this.connectSlice(this.listExpandedChanges
            .pipe(tap(console.log), map(b => ({listExpanded: b})))
        );

        this.connectSlice(this.selectionChanges
            .pipe(
                map(c => c.source.selectedOptions.selected.map(o => o.value)),
                map(selectedItems => ({selectedItems}))
            )
        );

    }

}


