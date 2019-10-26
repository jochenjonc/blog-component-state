import {Component} from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
        <ul>
            <li>
                <a [routerLink]="['timing']">timing</a>
            </li>
            <li>
                <a [routerLink]="['late-subscriber']">Late Subscriber</a>
            </li>

            <li>
                <a [routerLink]="['subscription-handling']">Subscription Handling</a>
            </li>

            <li>
                <a [routerLink]="['cold-composition']">Cold Composition</a>
            </li>

            <li>
                <a [routerLink]="['component-state']">Component State</a>
            </li>
            <li>
                <a [routerLink]="['process-override-slice']">Process Override Slice</a>
            </li>
            <li>
                <a [routerLink]="['sharing-a-reference']">Sharing A Reference</a>
            </li>
            <li>
                <a [routerLink]="['declarative-interaction']">Declarative Interaction</a>
            </li>
            <li>
                <a [routerLink]="['low-level-component-state']">Low Level Component State</a>
            </li>
        </ul>
        <router-outlet></router-outlet>
    `
})
export class AppComponent {

    constructor() {
        console.log('AppComponent Constructor');
    }

}
