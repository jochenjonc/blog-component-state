import {Component} from '@angular/core';
import {interval, of, timer} from 'rxjs';
import {take, tap} from "rxjs/operators";

@Component({
    selector: 'cold-composition-container',
    template: `
        <h1>Cold Composition</h1>
        {{asyncPipeFired$ | async}}
        <cold-composition-bad 
                [inputValue]="inputValue$ | async">
        </cold-composition-bad>
        <cold-composition [inputValue]="inputValue$ | async">
        </cold-composition> 
    `
})
export class ColdCompositionContainerComponent {
    asyncPipeFired$ = of('CONTAINER async pipe fired').pipe(tap(console.log));
    inputValue$ = timer(0, 1000)
}
