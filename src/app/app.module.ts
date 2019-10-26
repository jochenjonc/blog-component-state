import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {AppComponent} from './app.component';
import {ColdCompositionModule} from "./cold-composition/cold-composition.module";
import {LateSubscriberModule} from "./late-subscriber/late-subscriber.module";
import {SubscriptionHandlingModule} from "./subscription-handling/subscription-handling.module";
import {listReducer} from "./component-state/global-state/reducer";
import {GlobalEffects} from "./component-state/global-state/effects";
import {ROUTES} from "./app.routes";
import {TimingModule} from "./timing/timing.module";
import {DeclarativeInteractionModule} from "./declarative-interaction/declarative-interaction.module";
import {LowLevelComponentStateModule} from "./low-level-component-state/low-level-component-state.module";

@NgModule({
    imports: [
        BrowserModule, HttpClientModule, ReactiveFormsModule,
        StoreModule.forRoot({
            github:
                (state: any | undefined, action: any) => listReducer(state, action)
        }),
        EffectsModule.forRoot([GlobalEffects]),

        TimingModule,
        ColdCompositionModule,
        LateSubscriberModule,
        SubscriptionHandlingModule,
        DeclarativeInteractionModule,
        LowLevelComponentStateModule,

        RouterModule.forRoot(ROUTES)
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {


}
