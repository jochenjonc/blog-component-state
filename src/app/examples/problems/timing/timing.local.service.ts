import {Injectable} from '@angular/core';
import {interval, merge, Subject, Subscription} from 'rxjs';
import {mergeAll, publishReplay, scan, startWith, take, tap} from 'rxjs/operators';
import {LoggerService, LogObject} from "@common";

@Injectable({providedIn: 'root'})
export class TimingLocalService {
    sub = new Subscription();
    _initialState = 0;
    private states$ = new Subject();

    localState$ = merge(
        this.states$.pipe(mergeAll(), startWith(this._initialState)),
        interval(1000).pipe(take(2))
    )
        .pipe(
            scan((a: any, i) => a + i),
            tap(s => this.log({msg: 'ChildLocalService state changed to',data: s})),
            publishReplay(1)
        );

    constructor(private logger: LoggerService) {
        this.log({hook: "constructor"});
        this.sub = (this.localState$ as any).connect();
    }

    log(l: Partial<LogObject>) {
        this.logger.log({
            msg: "TimingLocalService",
            creator: "service",
            creatorInstance: 'TimingLocalService',
            ...l})
    }

    connectObservable(observable) {
        this.states$.next(observable);
    }

    ngOnDestroy() {
        this.log({msg: 'ChildLocalService OnDestroy'});
        this.sub.unsubscribe();
    }
}
