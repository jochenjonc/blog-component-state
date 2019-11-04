import {Component} from '@angular/core';
import {of, Subject} from 'rxjs';

@Component({
    selector: 'sharing-a-reference-container',
    template: `
        <p><b>formGroupModel$:</b></p>
        <pre>{{formGroupModel$ | async | json}}</pre>
        <hr/>
        <p><b>formValue1$:</b></p>
        <pre>{{formValue1$ | async | json}}</pre>
        <sharing-a-reference-bad-display
                [formGroupModel]="formGroupModel$ | async"
                (formValueChange)="formValue1$.next($event)">
        </sharing-a-reference-bad-display>
        <hr/>
        <p><b>formValue2$:</b></p>
        <pre>{{formValue2$ | async | json}}</pre>
        <sharing-a-reference-good-display
                [formGroupModel]="formGroupModel$ | async"
                (formValueChange)="formValue2$.next($event)">
        </sharing-a-reference-good-display>
    `
})
export class SharingAReferenceContainerComponent {

    formValue1$ = new Subject();
    formValue2$ = new Subject();

    formGroupModel$ = of({
        name: '',
        age: 0
    });

}
