import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'arc-mva-container',
    template:`   
        <h1>MVA</h1>
        <arc-mva-simple-list-view>
        </arc-mva-simple-list-view>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: []
})
export class ArchitectMVAContainerComponent {


}
