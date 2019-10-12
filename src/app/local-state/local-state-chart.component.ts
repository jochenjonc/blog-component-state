import {ChangeDetectionStrategy, Input,Output, Component} from '@angular/core';
import {FormGroup} from '@angular/forms'
import {Subject, Observable} from 'rxjs';
import {shareReplay, map,tap,startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'local-state-chart',
  template: `
  {{(form$ | async).value | json}}
   <h3>Display only chart</h3>
   <div>
    <ul>
      <li *ngFor="let item of (config$ | async)?.list">{{item.name}}</li>
    </ul>
   </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalStateChartComponent {

  config$ = new Subject<any[]>();
  @Input()
  set config(cfg) {
    this.config$.next(cfg || {});
  }
  
  form$: Observable<FormGroup> = this.config$
    .pipe(
      map(cfg => this.selectFormConfig(cfg)),
      startWith({}),
      map(fCfg => new FormGroup(fCfg)),
      tap(console.log),
      shareReplay(1)
    );
  
 // @Output()
 // change = this.form$.pipe(switchMap(f => f.valueChanges()));

  selectFormConfig(cfg): any {
    if('list' in cfg && 'selectedItems' in isArray(cfg && cfg.selectedItems) ) {

    }
    return cfg.list
     .reduce((acc, i) => ({[i.id]: !!(cfg.selectedItems.indexOf(i.id) !== -1)}), {})
  }

}
