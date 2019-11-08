import {combineLatest, interval} from "rxjs";
import {map, scan, startWith, switchMap, take} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {IListViewModelState} from "./list.view-model-state.interface";
import {IListView} from "./list.view.interface";
import {LocalState} from '@common';

@Injectable()
export class ListModel extends LocalState<IListViewModelState> implements IListView {

    // Initial view config
    private initState: IListViewModelState = {
        listExpanded: true,
        list: [],
        selectedItems: [],
        refreshInterval: 10000,
        refreshPending: false
    };

    selectExpanded(s: IListViewModelState): boolean {
        return s.listExpanded
    }


    constructor() {
        super();
        this.setSlice(this.initState);
    }

}

export function countDown(duration, samples) {
    return interval(duration/samples).pipe(
        scan((count, _) => --count, samples+1),
        take(samples)
    )
}
