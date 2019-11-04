import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {concat, merge, of, Subject, timer} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {ContainerFacade} from './+state/container.facade';
import {ListContainerViewModel} from "./list-container.view-model.interface";
import {selectListConfig} from "./+state/list-config.selectors";
import {initialListConfig} from "../components/list/list-config.interface";

@Component({
    selector: 'local-state-container',
    template: `
        <h2>Container</h2>
        Refresh every: {{inputValue$ | async}} milliseconds<br/>
        <local-state-chart
                [config]="listConfig | async"
                (selectedItemIdsChange)="selectedItemIdsChange$.next($event)"
                (refreshClick)="refreshClick$.next($event)">
        </local-state-chart>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListContainerComponent implements ListContainerViewModel {
    // VM implementation
    listConfig = this.facade.select<any>(selectListConfig);


    // Component internals
    inputValue$ = new Subject<number>();
    @Input()
    set inputValue(ms: number) {
        if(Number.isInteger(ms)) {
            this.inputValue$.next( ms);
        }
    }

    refreshClick$ = new Subject<Event>();
    selectedItemIdsChange$ = new Subject<string[]>();

    constructor(private facade: ContainerFacade) {
        this.facade.connectSlices({
            refreshMs:
                // @TODO move this setup into a config obj?
                concat(of(initialListConfig.refreshMs), this.inputValue$)
        });
        this.facade.connectSlices({selectedItemIds: concat(of([]), this.selectedItemIdsChange$)});

        this.facade.serverUpdateOn(
            merge(
                this.facade.refreshMs$
                    .pipe(switchMap((ms: number) => timer(0, ms))),
                this.refreshClick$
            )
        );
    }
}
