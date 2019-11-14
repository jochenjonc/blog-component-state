import {ChangeDetectionStrategy, Component} from '@angular/core';
import {of} from 'rxjs';

@Component({
    selector: 'late-subscribers-container',
    template: `
    <p><b>state$:</b></p>
    <pre>{{num$ | async | json}}</pre>
    <late-subscriber-display [state]="num$ | async">
    </late-subscriber-display>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateSubscribersContainerComponent {
    num$ = of(1);

    constructor() {
        console.log('Container Constructor')
    }

}
