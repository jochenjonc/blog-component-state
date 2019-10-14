import {Component} from '@angular/core';
import {of, timer} from 'rxjs';

@Component({
    selector: 'cold-composition-container',
    template: `
        <h1>Cold Composition</h1>
        <cold-composition-bad [inputValue]="tick$ | async"></cold-composition-bad>
        <cold-composition [inputValue]="tick$ | async"></cold-composition>
    `
})
export class ColdCompositionContainerComponent {
    tick$ = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
}
