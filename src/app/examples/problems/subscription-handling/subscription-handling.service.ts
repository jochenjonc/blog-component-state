import {Injectable, OnDestroy} from '@angular/core';
import {ObservableLike, Subject, SubscriptionLike} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SubscriptionHandlingService implements OnDestroy {

    onDestroy$ = new Subject();

    subscribe(o): void {
        o.pipe(takeUntil(this.onDestroy$))
            .subscribe();
    }

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
    }

}
