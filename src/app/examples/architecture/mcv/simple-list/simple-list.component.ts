import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SimpleListModel} from './simple-list.model';
import {SimpleListView} from "./simple-list.view";
import {map, scan, take, tap} from "rxjs/operators";
import {interval} from "rxjs";

@Component({
    selector: 'arc-mvc-simple-list-view',
    templateUrl: './simple-list.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SimpleListModel, SimpleListView]
})
export class SimpleListMVCComponent {

    constructor(public v: SimpleListView,
                public m: SimpleListModel) {
        // Connect Model
        this.m.connectSlice(this.v.listExpandedChanges
            .pipe(map(listExpanded => ({listExpanded}))));
        // Register Side-Effects
        this.m.connectEffect(this.v.refreshClicks
            .pipe(tap(_ => this.m.refreshRequest.next(true))));
    }

}
