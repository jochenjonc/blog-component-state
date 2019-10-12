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

  @Output()
  change = this.form$.pipe(switchMap(f => f.valueChanges()));

  form$ = this.config$
    .pipe(
      map(this.selectFormConfig),
      map(fCfg => new FormGroup(fCfg) ),
      shareReplay(1)
    );

  selectFormConfig = (cfg): any => {
    return cfg.list
     .reduce((acc, i) => ({[i.id]: !!(cfg.selectedItems.indexOf(i.id) !== -1)}), {})
  }

}
