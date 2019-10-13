import { Injectable, OnDestroy } from '@angular/core';
import { Subject} from 'rxjs';
import { takeUntil} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComponentStateService implements OnDestroy {

  onDestroy$ = new Subject();

  constructor() {
  }

  connect(o) {
    o
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
  }

}
