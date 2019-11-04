import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {AppViewModel} from "./app.view.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppViewModel]
})
export class AppComponent {
  constructor(public vm: AppViewModel) {
    console.log('AppComponent Constructor');
  }
}
