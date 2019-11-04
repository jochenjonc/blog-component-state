import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
    selector: 'arc-mvvm-container',
    template: `
        <h2>MVVM</h2>
        <arc-mvvm-simple-list-view>
        </arc-mvvm-simple-list-view>
        <arc-mvvm-list-view (selectionChanges)="selectedItemIdsObserver.next($event)">
        </arc-mvvm-list-view>
        <pre>{{selectedItemIdsObserver | async | json}}</pre>
        <!--     -->
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchitectMVVMContainerComponent {
    selectedItemIdsObserver = new Subject<string[]>();
}
