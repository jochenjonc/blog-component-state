import {ChangeDetectionStrategy, Component} from '@angular/core';
import {timer} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
    selector: 'local-state-page',
    template: `
        <h1>Page</h1>
        <local-state-container
                [inputValue]="num$ | async"></local-state-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalStatePageComponent {
    num$ = timer(0, 10000).pipe(map(_ => Math.random() < 0.5 ? 10000 : 5000));
}
