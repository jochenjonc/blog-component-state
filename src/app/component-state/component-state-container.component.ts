import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {concat, merge, of, Subject, timer} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {ContainerFacade} from './container.facade';

@Component({
    selector: 'local-state-container',
    template: `
        <h2>Container</h2>
        Refresh every: {{inputValue$ | async}} milliseconds<br/>
        <local-state-chart
                [config]="listConfig$ | async"
                (selectedItemIdsChange)="selectedItemIdsChange$.next($event)"
                (refreshClick)="refreshClick$.next($event)">
        </local-state-chart>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentStateContainerComponent {

    listConfig$ = this.facade.listConfig$;
    inputValue$ = new Subject<number>();

    @Input()
    set inputValue(ms: number) {
        this.inputValue$.next(Number.isInteger(ms) ? ms : 10000);
    }

    refreshClick$ = new Subject<Event>();
    selectedItemIdsChange$ = new Subject<string[]>();

    constructor(private facade: ContainerFacade) {
        this.facade.connectSlices({
            refreshMs:
                // @TODO move this setup into a config obj?
                concat(
                    // initial state
                    of([]),
                    // state changes
                    this.inputValue$,
                    // state after completion
                    of(undefined),
                    // state after error
                    catchError(e => of(undefined))
                )
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
