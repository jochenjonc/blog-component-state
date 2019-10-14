import {Component} from '@angular/core';
import {of, timer} from 'rxjs';
import {take} from "rxjs/operators";

@Component({
    selector: 'cold-composition-container',
    template: `
        <h1>Cold Composition</h1>
        <cold-composition-bad [inputValue]="tick$ | async"></cold-composition-bad>
        <cold-composition [inputValue]="tick$ | async"></cold-composition>
    `
})
export class ColdCompositionContainerComponent {
    tick$ = of({input: 1}, {input: 2}, {input: 3}).pipe(take(3));
}
