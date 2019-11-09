import {combineLatest, interval, merge, Subject, timer} from "rxjs";
import {
    endWith,
    filter,
    map,
    scan,
    shareReplay,
    startWith,
    switchMap,
    take,
    takeUntil,
    withLatestFrom
} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {IListViewModelState} from "./list.view-model-state.interface";
import {IListView} from "./list.view.interface";
import {MatSelectionListChange} from "@angular/material";
import {LocalState} from '@common';
import {SimpleListItem} from "../../interfaces";
@Injectable()
export class ListViewModel extends LocalState<IListViewModelState> implements IListView {
    // Initial view config
    private initState: IListViewModelState = {
        listExpanded: true,
        list: [],
        selectedItems: [],
        refreshPeriod: 1000 * 20,
        refreshPending: false
    };
    // IListView (events from the view) =================================================
    refreshClicks = new Subject<Event>();
    selectionChanges = new Subject<MatSelectionListChange>();
    listExpandedChanges = new Subject<boolean>();

    // Special vm state derivations
    selectedOptions = this.state$
        .pipe(map(s => toIdMap(s.selectedItems)));

    private idleRefreshClicks = this.refreshClicks.pipe(
      // withLatestFrom(this.select(s => s.refreshPending)),
        // filter()
    );
    private refreshInterval = combineLatest(
        this.idleRefreshClicks.pipe(startWith(0)),
        this.select(s => s.refreshPeriod)
    )
        .pipe(switchMap(([_, period]) => timer(0, period)));

    // We keep this out of the local store as it could change in a high frequency
    countDownOutput$ = this.refreshInterval.pipe(
        withLatestFrom(this.select((s => s.refreshPeriod))),
        switchMap(([_, period]) => countDown(period, 80, 100)),
        shareReplay(1)
    );

    // Output bindings like
    refreshTrigger = merge(
        this.refreshClicks,
        this.refreshInterval
    );

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

// @TODO test selector pipes
export function toIdMap(selectedItems: SimpleListItem[]) {
    return selectedItems
        .reduce((m, i) => ({...m, [i.id]: true}),
            {} as { [key: string]: boolean })
}

export function countDown(period = 100, samples = 100, range = 100) {
    console.log('countDown')
    const sampleRate = period/samples;
    const initialCount = samples + 1;
    return timer(0, sampleRate).pipe(
        scan((count, _) => --count, initialCount),
        takeUntil(interval(period)),
        map(s => ~~(range/samples * s)),
        endWith(0)
    )
}
