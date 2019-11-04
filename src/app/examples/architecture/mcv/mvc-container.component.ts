import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject, combineLatest, of, Subject} from 'rxjs';
import {ListConfig, selectedIds} from "./list-view/list.component.interface";
import {distinctUntilChanged, map} from "rxjs/operators";

@Component({
    selector: 'arc-mvc-container',
    template: `
        <h2>MVC</h2>
        <arc-mvc-list-view>
        </arc-mvc-list-view>
        <pre>{{selectedItemIdsObserver | async | json}}</pre>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchitectMVCContainerComponent {
    config: ListConfig = {
        list: [],
        selectedItemIds: []
    };
    configChanges =  new BehaviorSubject<ListConfig>(this.config);

    selectedItemIdsObserver = new Subject<selectedIds>();

    constructor() {

    }
}
