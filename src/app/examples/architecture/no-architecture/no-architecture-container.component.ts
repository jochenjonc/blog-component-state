import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'arc-no-architecture-container',
    template:`   
        <h1>NoArchitectureContainerComponent</h1>
        <arc-no-architecture-simple-list-view>
        </arc-no-architecture-simple-list-view>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: []
})
export class NoArchitectureContainerComponent {


}
