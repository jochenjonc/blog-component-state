import {ChangeDetectionStrategy, Component, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms'
import {Subject} from 'rxjs';
import {map, shareReplay, switchMap} from 'rxjs/operators';
import {isArray} from './utils';

export interface ListConfig {
    list: any[],
    selectedItemIds: string[]
}

@Component({
    selector: 'local-state-chart',
    template: `
        <h3>Display only chart</h3>
        <form [formGroup]="form$ | async">
            <button (click)="refreshClick.next($event)">Refresh</button>
            <ul>
                <li *ngFor="let item of (config$ | async)?.list">
                    <label>
                        <input type="checkbox" [formControlName]="item.id">
                        {{item.name}}
                    </label>
                </li>
            </ul>
        </form>
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
    set config(cfg) {
        // @TODO how to deal with all the checks here??
        if (cfg &&
            'list' in cfg && isArray(cfg.list) &&
            'selectedItems' in cfg && isArray(cfg.selectedItems)) {
            this.config$.next(cfg);
        }
    }

    getFormGroupFromConfig(cfg): FormGroup {
        // @TODO where to put the ugly string cast? => just use strings as id? :D
        return this.fb.group(
            cfg.list
            .reduce((acc, i) => ({...acc, [i.id]: cfg.selectedItems.indexOf(i.id) !== -1}), {})
        )
    }

}
