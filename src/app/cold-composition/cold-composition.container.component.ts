import {Component} from '@angular/core';
import {interval, of, timer} from 'rxjs';
import {take} from "rxjs/operators";

@Component({
    selector: 'cold-composition-container',
    template: `
        <h1>Cold Composition</h1>
        <cold-composition-bad 
                [inputValue]="inputValue$ | async"
                [otherInputValue]="otherInputValue$ | async">
        </cold-composition-bad>
       <!-- <cold-composition [inputValue]="inputValue$ | async"></cold-composition> -->
    `
})
export class ColdCompositionContainerComponent {
    inputValue$ = interval(0).pipe(take(3));
    otherInputValue$ = interval(0).pipe(take(3));
}
