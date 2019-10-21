import {Injectable, OnDestroy} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {groupBy, map, mergeAll, scan, switchMap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProcessHandlerService implements OnDestroy {

    onDestroy$ = new Subject();

    stateObservables$$ = new Subject<{ [key: string]: Observable<number> }>();
    state$ = this.stateObservables$$
        .pipe(
            // {sliceName: observable} => sliceName
            groupBy((obj) => Object.entries(obj)[0][0]),
            map(o$ => o$
                .pipe(
                    // {sliceName: observable} => observable.pipe(map(value => ({[sliceName]:value}))
                    switchMap(obj => of(Object.entries(obj)[0]
                            .map(([key, o$]:any) => o$
                                .pipe(
                                    map(value => ({[key]: value}))
                                )
                            )
                        )
                    )
                )
            ),
            mergeAll(),
            scan((acc, [key, value]: [string, number]): { [key: string]: number } => ({...acc, [key]: value}), {})
        );

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
    }

}
