import {ChangeDetectionStrategy, Component, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms'
import {Subject} from 'rxjs';
import {map, shareReplay, startWith, switchMap} from 'rxjs/operators';
import {isArray} from './utils';
import {Item} from "./global-state/item.interface";

export interface ListConfig {
    list: Item[],
    selectedItemIds: string[]
}

@Component({
    selector: 'local-state-chart',
    template: `
        <h3>Display-Only List Component</h3>
        <button (click)="refreshClick.next($event)">Refresh</button>
        <form *ngIf="form$ | async as form; else noList" [formGroup]="form">
            <ul>
                <li *ngFor="let item of (config$ | async)?.list">
                    <label>
                        <input type="checkbox" [formControlName]="item.id">
                        {{item.id}}:{{item.name}}
                    </label>
                </li>
            </ul>
        </form>
        <ng-template #noList>
            No list given
        </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentStateListComponent {

    config$ = new Subject<ListConfig>();
    form$ = this.config$
        .pipe(
            map(cfg => this.getFormGroupFromConfig(cfg)),
            shareReplay(1)
        );

    @Output()
    selectedItemIdsChange = this.form$
        .pipe(
            switchMap(f => f.valueChanges),
            map(obj => Object.entries(obj).filter(a => a[1]).map(a => a[0] + ''))
        );

    @Output()
    refreshClick = new Subject<Event>();

    constructor(private fb: FormBuilder) {

    }

    @Input()
    set config(cfg: ListConfig) {
        // @TODO how to deal with all the checks here??
        if (cfg &&
            'list' in cfg && isArray(cfg.list) &&
            'selectedItemIds' in cfg && isArray(cfg.selectedItemIds)) {
            this.config$.next(cfg);
        }
    }

    getFormGroupFromConfig(cfg: ListConfig): FormGroup {
        return this.fb.group(
            cfg.list
            .reduce((acc, i) => ({...acc, [i.id]: cfg.selectedItemIds.indexOf(i.id) !== -1}), {})
        )
    }

}
