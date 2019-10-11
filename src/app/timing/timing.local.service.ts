import {Injectable, OnDestroy} from '@angular/core';
import {Subject, of, merge, interval} from 'rxjs';
import {scan,startWith, take, publishReplay, mergeAll, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class TimingLocalService {
  sub;
  _initialState = 0; 
  private states$ = new Subject();
  
  localState$ = merge(
    this.states$.pipe(mergeAll(), startWith(this._initialState)),
    interval(1000).pipe(take(2))
  )
    .pipe(
      scan((a:any, i) => a + i),
      tap(s => console.log('ChildLocalService state changed to', s)),
      publishReplay(1)
    );

  constructor() {
    console.log('ChildLocalService Constructor');
    this.sub = (this.localState$ as any).connect();
  }

  connectObservable(observable) {
    this.states$.next(observable);
  }

  ngOnDestroy() {
    console.log('ChildLocalService OnDestroy');
    this.sub.unsubscribe();
  }
}