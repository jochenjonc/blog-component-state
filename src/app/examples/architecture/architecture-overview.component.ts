import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'architect-overview',
    template: `
        <h1>Architecture Overview</h1>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchitectureOverviewComponent {

}
