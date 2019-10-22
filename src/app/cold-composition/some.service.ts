import {Injectable, OnDestroy} from '@angular/core';
import {of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SomeService {

    value$ = of(10)

}
