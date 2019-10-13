import {ChangeDetectionStrategy, Component} from '@angular/core';
import {timer} from 'rxjs';
import {map} from 'rxjs/operators';
import {SubscriptionHandlingService} from './subscription-handling.service';

@Component({
  selector: 'subscription-handling',
  template: `
   <h1>Subscription Handling</h1>
  `,
  providers: [SubscriptionHandlingService]
})
export class LocalStatePageComponent {
  sideEffect$ = timer(0, 10000);

  constructor(private subHandles: SubscriptionHandlingService)  {
    this.subHandles.connect(this.sideEffect$)
  }
}
