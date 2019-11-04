import {ChangeDetectionStrategy, Component} from '@angular/core';
import {timer} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
    selector: 'architect-overview',
    template: `
        <h1>Architecture Overview</h1>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchitectureOverviewComponent {

}
