import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnChanges,
    OnDestroy,
    OnInit
} from '@angular/core';
import {of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {LoggerService, LogObject} from "@common";

@Component({
    selector: 'timing-parent',
    template: `
   <p>Parent Template Expression: {{templateExpression$ | async}}</p>
   <mat-list>
       <mat-list-item class="log" 
                      [ngClass]="log.creator + ' ' + log.hook" 
                      *ngFor="let log of logs$ | async">
           {{log.msg}}
       </mat-list-item>
   </mat-list>
    <timing-child 
      [value]="templateBinding$ | async"
       timing-child-dir
    >
    </timing-child>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [``]
})
export class TimingParentComponent implements OnChanges, OnInit, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {

    templateExpression$ = of('expression').pipe(tap(_ => this.log({hook: 'template-expression'})));

    templateBinding$ = of('binding').pipe(tap(_ => this.log({hook:'template-binding'})));

    logs$ = this.logger.logs$;

    constructor(private logger: LoggerService) {
        this.log({hook: "constructor"});
    }

    log(l: Partial<LogObject>) {
        this.logger.log({
            msg: "ParentComponent",
            creator: "component",
            creatorInstance: 'TimingParentComponent',
            ...l})
    }

    ngOnChanges(changes) {
        this.log({hook: "ngOnChanges", data: changes});
    }

    ngOnInit() {
        this.log({hook: "ngOnInit"});
    }

    ngAfterContentInit() {
        this.log({hook: "ngAfterContentInit"});
    }

    ngAfterContentChecked() {
        this.log({hook: "ngAfterContentChecked"});
    }

    ngAfterViewInit() {
        this.log({hook: "ngAfterViewInit"});
    }

    ngAfterViewChecked() {
        this.log({hook: "ngAfterViewChecked"});
    }

    ngOnDestroy() {
        this.log({hook: "ngOnDestroy"});
    }

}
