import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SimpleListAdapter} from "./simple-list.adapter";
import {ISimpleListView} from "./simple-list.view.interface";
import {SimpleListModel} from "./simple-list.model";

@Component({
    selector: 'arc-mva-simple-list-view',
    templateUrl: './simple-list.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SimpleListAdapter, SimpleListModel]
})
export class SimpleListMVAComponent implements ISimpleListView {
    // ISimpleListView =================================================
    refreshClicks = this.a.refreshClicks;
    listExpandedChanges = this.a.listExpandedChanges;

    list$ = this.a.list$;
    listExpanded$ = this.a.listExpanded$;

    constructor(private a:SimpleListAdapter) {

    }
}
