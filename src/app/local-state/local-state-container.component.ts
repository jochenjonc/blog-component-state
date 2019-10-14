import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {merge, Subject, timer} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {ContainerFacade} from './container.facade';

@Component({
    selector: 'local-state-container',
    template: `
        <h2>Container</h2>
        <local-state-chart
                [config]="listConfig$ | async"
                (selectedItemsChange)="selectedItemsChange$.next($event)"
                (refreshClick)="refreshClick$.next($event)"
        ></local-state-chart>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalStateContainerComponent {

    listConfig$ = this.facade.listConfig$;

    inputValue$ = new Subject<number>();
    refreshClick$ = new Subject<Event>();
    selectedItemsChange$ = new Subject();

    constructor(private facade: ContainerFacade) {
        // @TODO use animation frame to stop polling when leaving tab
        this.facade.connectSlices({refreshMs$: this.inputValue$});
        this.facade.connectSlices({selectedItems$: this.selectedItemsChange$});
        this.facade.serverUpdateOn(
            merge(
                this.facade.refreshMs$
                    .pipe(switchMap((ms: number) => timer(0, ms))),
                this.refreshClick$
            )
        );

    }

    @Input()
    set inputValue(ms: number) {
        if (Number.isInteger(ms)) {
            this.inputValue$.next(ms);
        } else {
            this.inputValue$.next(10000);
        }
    }

}
