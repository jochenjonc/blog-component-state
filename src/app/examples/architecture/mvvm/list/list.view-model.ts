import {combineLatest, interval, Subject} from "rxjs";
import {map, scan, startWith, switchMap, take} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {IListViewModelState} from "./list.view-model-state.interface";
import {IListView} from "./list.view.interface";
import {MatSelectionListChange} from "@angular/material";
import {LocalState} from '@common';
@Injectable()
export class ListViewModel extends LocalState<IListViewModelState> implements IListView {

    // Initial view config
    private initState: IListViewModelState = {
        listExpanded: true,
        list: [],
        selectedItems: [],
        refreshInterval: 10000,
        refreshPending: false
    };
    // IListView (events from the view) =================================================
    refreshClicks = new Subject<Event>();
    selectionChanges = new Subject<MatSelectionListChange>();
    listExpandedChanges = new Subject<boolean>();

    // Special vm state derivations
    // @TODO test selector pipes
    selectedOptions = this.state$
        .pipe(
            map(s => s.selectedItems
                .reduce((m, i) => ({...m, [i.id]: true}),
                    {} as { [key: string]: boolean })
            )
        );

    selectedOptionsMap(s) {
        return s.selectedItems
            .reduce((m, i) => ({...m, [i.id]: true}),
                {} as { [key: string]: boolean })
    }

    refreshTrigger = combineLatest(
        this.refreshClicks
    );

    countDown = combineLatest(
        this.refreshClicks.pipe(startWith(true)),
        this.state$.pipe(
            map(s => s.refreshInterval)
        )).pipe(
        switchMap(([e, duration]) => {
            console.log('duration', duration);
            return countDown(duration, 40)
        })
    );

    selectExpanded(s: IListViewModelState): boolean {
        return s.listExpanded
    }


    constructor() {
        super();
        this.setSlice(this.initState);

        this.connectSlice(this.listExpandedChanges
            .pipe(map(b => ({listExpanded: b})))
        );

        this.connectSlice(this.selectionChanges
            .pipe(
                map(c => c.source.selectedOptions.selected.map(o => o.value)),
                map(selectedItems => ({selectedItems}))
            )
        );

    }

}

export function countDown(duration, samples) {
    return interval(duration/samples).pipe(
        scan((count, _) => --count, samples+1),
        take(samples)
    )
}
