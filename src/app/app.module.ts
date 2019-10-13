import { NgModule, DoBootstrap } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import { StoreModule} from '@ngrx/store';
import { EffectsModule} from '@ngrx/effects';

import { listReducer } from './local-state/global-state/reducer';
import { GlobalEffects } from './local-state/global-state/effects';


import { AppComponent } from './app.component';
import { TimingGlobalService } from './timing/timing.global.service';

import { TimingParentComponent } from './timing/timing.parent.component';
import { TimingChildComponent } from './timing/timing.child.component';
import { TimingChildDirective } from './timing/timing.child.directive';
import { TimingChildPipe } from './timing/timing.child.pipe';


  
import { LateSubscribersContainerComponent } from './late-subscriber/late-subscriber.container.component';
import { LateSubscriberDisplayComponent } from './late-subscriber/late-subscriber.display.component';

import { SubscriptionHandlingComponent } from './subscription-handling/subscription-handling.component';
import { SubscriptionHandlingBadComponent } from './subscription-handling/subscription-handling-bad.component';

import { LocalStatePageComponent } from './local-state/local-state-page.component';
import { LocalStateContainerComponent } from './local-state/local-state-container.component';
import { LocalStateListComponent } from './local-state/local-state-list.component';
  

@NgModule({
  imports:      [ 
  BrowserModule, HttpClientModule, ReactiveFormsModule,
  StoreModule.forRoot({github: 
    (state: any | undefined, action: any) => listReducer(state, action)
  }),
  EffectsModule.forRoot([GlobalEffects]), 
  RouterModule.forRoot([
    {
      path:'',
      pathMatch: 'full',
      redirectTo: 'late-subscriber'
    },
    {
      path:'timing',
      component: TimingParentComponent
    },
    {
      path:'late-subscriber',
      component: LateSubscribersContainerComponent
    },
    {
      path: 'local-state',
      component: LocalStatePageComponent
    },
    {
      path: 'subscription-handling',
      component: SubscriptionHandlingComponent
    }
    ]) ],
  declarations: [ 
    AppComponent, 
    
    TimingParentComponent, TimingChildComponent, 
    TimingChildDirective, TimingChildPipe,

    LateSubscribersContainerComponent,
    LateSubscriberDisplayComponent,

    SubscriptionHandlingComponent, SubscriptionHandlingBadComponent,

    LocalStatePageComponent,  LocalStateContainerComponent, LocalStateListComponent
   ],
  bootstrap:    [ AppComponent ]
})
export class AppModule {

  constructor(private globalService: TimingGlobalService) {
    console.log('AppModule Constructor'); 
  }

}
