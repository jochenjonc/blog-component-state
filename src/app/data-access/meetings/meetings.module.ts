import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {MEETING_FEATURE_KEY, meetingReducer} from "./+state/reducer";
import {MeetingEffects} from "./+state/effects";

@NgModule({
    imports: [
        StoreModule.forFeature(MEETING_FEATURE_KEY, meetingReducer),
        EffectsModule.forFeature([MeetingEffects]),
    ],
    declarations: [],
    bootstrap: []
})
export class MeetingsModule {


}
