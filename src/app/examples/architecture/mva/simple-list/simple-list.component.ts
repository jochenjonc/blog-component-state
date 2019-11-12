import {ChangeDetectionStrategy, Component} from '@angular/core';
import {map, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {SimpleListAdapter} from "./simple-list.adapter";

@Component({
    selector: 'arc-mva-simple-list-view',
    templateUrl: './simple-list.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SimpleListAdapter]
})
export class SimpleListMVAComponent {
    // IListView =================================================
    refreshClicks = new Subject<Event>();
    listExpandedChanges = new Subject<boolean>();

    constructor(public a:SimpleListAdapter) {
        this.a.connectState(this.listExpandedChanges
            .pipe(map(b => ({listExpanded: b})))
        );

        // Register Side-Effects For lifetime of ViewModel
        this.a.connectEffect(this.refreshClicks.pipe(tap(this.a.refreshRequest)));
    }
}
