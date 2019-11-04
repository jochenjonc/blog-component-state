import {ChangeDetectionStrategy, Component} from '@angular/core';
import {of, Subject} from 'rxjs';
import {ListConfig, selectedIds} from "./list/list.component.interface";

@Component({
    selector: 'arc-mvvm-container',
    template: `
        <h2>MVVM</h2>
        <arc-mvvm-simple-list-view>
        </arc-mvvm-simple-list-view>
        <!--
        <arc-mvvm-list-view 
                [config]="configChanges | async"
                (selectedItemIdsChanges)="selectedItemIdsObserver.next($event)">
        </arc-mvvm-list-view>
         -->
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchitectMVVMContainerComponent {
    config: ListConfig = {
        list: [],
        selectedItemIds: []
    };
    configChanges = of(this.config);

    selectedItemIdsObserver = new Subject<selectedIds>();
}
