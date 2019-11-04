import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {map, scan, takeUntil, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ComponentStateBadService implements OnDestroy {

    onDestroy$ = new Subject();

    state$$ = new Subject<{ [key: string]: number }>();
    state$ = this.state$$
        .pipe(
            map(obj => Object.entries(obj)[0]),
            scan((acc, [key, value]: [string, number]): { [key: string]: number } => ({...acc, [key]: value}), {})
        );


    ngOnDestroy(): void {
        this.onDestroy$.next(true);
    }

}
