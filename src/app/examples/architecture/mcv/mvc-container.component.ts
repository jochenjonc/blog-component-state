import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Component({
    selector: 'arc-mvc-container',
    template: `
        <h2>MVC</h2>
        <div class="row">
            <div class="col">
                <arc-mvvm-simple-list-view>
                </arc-mvvm-simple-list-view>
            </div>
            <div class="col">
                <arc-mvvm-list-view (selectionChanges)="selectedItemIdsObserver.next($event)">
                </arc-mvvm-list-view>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchitectMVCContainerComponent {
    config = {
        list: [],
        selectedItemIds: []
    };
    configChanges =  new BehaviorSubject<any>(this.config);

    selectedItemIdsObserver = new Subject<string[]>();

    constructor() {

    }
}
