import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {merge, Subject, timer} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {ContainerFacade} from './container.facade';

@Component({
    selector: 'local-state-container',
    template: `
        <h2>Container</h2>
        listConfig$: {{listConfig$ | async | json}}
        Refresh every: {{(refreshClick$ | async) / 1000}} seconds
        <local-state-chart
                [config]="listConfig$ | async"
                (selectedItemIdsChange)="selectedItemIdsChange$.next($event)"
                (refreshClick)="refreshClick$.next($event)"
        >
        </local-state-chart>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentStateContainerComponent {

    listConfig$ = this.facade.listConfig$;
    inputValue$ = new Subject<number>();

    @Input()
    set inputValue(ms: number) {
        console.log('ms', ms);
        this.inputValue$.next(Number.isInteger(ms) ? ms : 10000);
    }

    refreshClick$ = new Subject<Event>();
    selectedItemIdsChange$ = new Subject<string[]>();

    constructor(private facade: ContainerFacade) {
        this.facade.connectSlices({refreshMs: this.inputValue$});
        this.facade.connectSlices({selectedItemIds: this.selectedItemIdsChange$});

        this.facade.serverUpdateOn(
            merge(
                this.facade.refreshMs$
                    .pipe(switchMap((ms: number) => timer(0, ms))),
                this.refreshClick$
            )
        );
    }
}
