import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'arc-mva-container',
    template:`   
        <h1>NoArchitectureContainerComponent</h1>
        <arc-mva-simple-list-view>
        </arc-mva-simple-list-view>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: []
})
export class ArchitectMVAContainerComponent {


}
