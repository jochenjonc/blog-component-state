import {ChangeDetectionStrategy, Component, Input, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {ListConfig, ListViewModel} from './list.view-model';
import {IListComponent} from "./list.component.interface";

export interface FormGroupConfig {
    [itemId: string]: [boolean]
}

@Component({
    selector: 'local-state-chart',
    template: `
        <!-- NOTE: in the view the only variable we want to touch is \`vm\`-->
        <h3>List Component</h3>
        <button (click)="refreshClick.next($event)">Refresh</button>
        <form *ngIf="vm.formO | async as form; else noList" [formGroup]="form">
            <ul>
                <li *ngFor="let item of (vm.configO | async)?.list; trackBy:vm.getId">
                    <label>
                        <input type="checkbox" [formControlName]="item.id">
                        {{item.id}}:{{item.name}}
                    </label>
                </li>
            </ul>
        </form>
        <ng-template #noList>
            No list given!
        </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements IListComponent {

    @Input()
    set config(c: ListConfig) {
        this.vm.configSubjectO.next(c);
    };
    @Output()
    readonly refreshClick = new Subject<Event>();
    @Output()
    readonly selectedItemIdsChange = this.vm.selectedItemIds;

    constructor(public vm: ListViewModel) {

    }

}
