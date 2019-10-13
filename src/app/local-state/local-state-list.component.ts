import {ChangeDetectionStrategy, Input,Output, Component} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms'
import {Subject, Observable} from 'rxjs';
import {shareReplay, map, filter, tap, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'local-state-chart',
  template: `
  {{(form$ | async).value | json}}
   <h3>Display only chart</h3>
   <form [formGroup]="form$ | async">
    <ul>
      <li *ngFor="let item of (config$ | async)?.list">
      <label>
        <input type="checkbox" [formControlName]="item.id">
        {{item.name}}
      </label>
      </li>
    </ul>
   </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalStateListComponent {

  config$ = new Subject<any[]>(); 
  @Input()
  set config(cfg) {
    this.config$.next(cfg || {});
  }
  
  form$: Observable<FormGroup> = this.config$
    .pipe(
      map(cfg => this.selectFormConfig(cfg)),
      startWith({}),
      map(fCfg => this.fb.group(fCfg)),
      shareReplay(1)
    );
  
 @Output()
 selectedItemsChange = this.form$
    .pipe(
      switchMap(f => f.valueChanges),
      map(obj => Object.entries(obj).filter(a => a[1]).map(a => a[0])),
            tap(console.log)
    );

 constructor(private fb: FormBuilder) {

 }

  selectFormConfig(cfg): any {
   console.log('cfg', cfg);
    if('list' in cfg && 'selectedItems' in cfg) {
      return cfg.list
        .reduce((acc, i) => ({...acc, [i.id]: !!(cfg.selectedItems.indexOf(i.id) !== -1)}), {})
    }
  }

}
