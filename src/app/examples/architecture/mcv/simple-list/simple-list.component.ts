import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SimpleListModel} from './simple-list.model';
import {SimpleListView} from "./simple-list.view";
import {map, tap} from "rxjs/operators";

@Component({
    selector: 'arc-mvc-simple-list-view',
    templateUrl: './simple-list.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SimpleListModel, SimpleListView]
})
export class SimpleListMVCComponent {

    constructor(private v: SimpleListView,
                private m: SimpleListModel) {

        this.m.connectSlice(this.v.listExpandedChanges
            .pipe(map(listExpanded => ({listExpanded}))));
        this.m.connectEffect(this.v.refreshClicks
            .pipe(tap(_ => this.m.refreshRequest.next(true))));

    }

}
