import {Component} from '@angular/core';
import {interval, of, timer} from 'rxjs';
import {take, tap} from "rxjs/operators";

@Component({
    selector: 'cold-composition-container',
    template: `
        <h1>Cold Composition</h1>
        {{asyncPipeFired$ | async}}
        <cold-composition-bad 
                [inputValue]="1"
                [otherInputValue]="otherInputValue$ | async">
        </cold-composition-bad>
       <!-- <cold-composition [inputValue]="inputValue$ | async"></cold-composition> -->
    `
})
export class ColdCompositionContainerComponent {
    asyncPipeFired$ = of('CONTAINER async pipe fired').pipe(tap(console.log));
    inputValue$ = interval(0).pipe(take(3));
    otherInputValue$ = interval(0).pipe(take(3));
}
