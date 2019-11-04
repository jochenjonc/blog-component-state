import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Component({
    selector: 'arc-mvc-container',
    template: `
        <h2>MVC</h2>
        
        <pre>{{selectedItemIdsObserver | async | json}}</pre>
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
