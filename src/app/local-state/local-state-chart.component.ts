import {ChangeDetectionStrategy, Input,Output, Component} from '@angular/core';
import {FormGroup} from '@angular/forms'
import {Subject} from 'rxjs';
import {shareReplay, map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'local-state-chart',
  template: `
   <h3>Display only chart</h3>
   <form>
   {{config$ | async | json}}
   <ul>
   <li *ngFor="let item of list$ | async">{{item.name}}</li>
   </ul>
   </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalStateChartComponent {

  config$ = new Subject<any[]>();
  @Input()
  set config(cfg) {
    this.config$.next(cfg);
  }
  
  form$ = this.config$
    .pipe(
      map(this.selectFormConfig),
      map(fCfg => new FormGroup(fCfg)),
      shareReplay(1)
    );
  
  @Output()
  change = this.form$.pipe(switchMap(f => f.valueChanges()));

  selectFormConfig = (cfg): any => {
    return cfg.list
     .reduce((acc, i) => ({[i.id]: !!(cfg.selectedItems.indexOf(i.id) !== -1)}), {})
  }

}
