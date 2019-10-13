import {Component} from '@angular/core';
import {timer} from 'rxjs';

@Component({
    selector: 'cold-composition-container',
    template: `
        <h1>Cold Composition</h1>
        <cold-composition-bad [inputValue]="tick$ | async"></cold-composition-bad>
        <cold-composition [inputValue]="tick$ | async"></cold-composition>
    `
})
export class ColdCompositionContainerComponent {
    tick$ = timer(0, 200);
}
