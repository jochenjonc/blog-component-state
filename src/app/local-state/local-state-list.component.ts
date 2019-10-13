import {ChangeDetectionStrategy, Input,Output, Component} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms'
import {Subject, Observable, interval} from 'rxjs';
import {shareReplay, map, filter, tap, startWith, switchMap} from 'rxjs/operators';
import {isArray} from './utils';

@Component({
  selector: 'local-state-chart',
  template: `
   <h3>Display only chart</h3>
   <form [formGroup]="form$ | async">
   <button (click)="refreshClick.next($event)">Refresh</button>
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
    // @TODO how to deal with all the checks here??
    if(cfg && 
    'list' in cfg && isArray(cfg.list) &&
    'selectedItems' in cfg && isArray(cfg.selectedItems)) {
      this.config$.next(cfg); 
    }
  }
  

  form$: Observable<FormGroup> = this.config$
    .pipe(
      map(cfg => this.selectFormConfig(cfg)),
      map(fCfg => this.fb.group(fCfg)),
      shareReplay(1)
    );
  
 @Output()
 selectedItemsChange = this.form$
    .pipe(
      switchMap(f => f.valueChanges),
      map(obj => Object.entries(obj).filter(a => a[1]).map(a => a[0]+''))
    );

  @Output()
  refreshClick = new Subject();

 constructor(private fb: FormBuilder) {

 }

  selectFormConfig(cfg): any {
    // @TODO where to put the ugly string cast?
      return cfg.list
        .reduce((acc, i) => ({...acc, [i.id+'']: !!(cfg.selectedItems.indexOf(i.id+'') !== -1)}), {})
  }

}
