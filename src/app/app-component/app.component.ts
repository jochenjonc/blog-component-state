import {Component} from '@angular/core';
import {AppViewModel} from "./app.view.model";
import {LoggerService} from "@common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppViewModel]
})
export class AppComponent {
  constructor(public vm: AppViewModel, private logger: LoggerService) {
    this.logger.log('AppComponent Constructor');
  }
}
