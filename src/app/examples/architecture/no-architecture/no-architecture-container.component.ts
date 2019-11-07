import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'arc-no-architecture-container',
    template:`   
        <h1>NoArchitectureContainerComponent</h1>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: []
})
export class NoArchitectureContainerComponent {


}
