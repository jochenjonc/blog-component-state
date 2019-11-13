import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {reducer as meetingReducer} from "./+state/meeting/meeting.reducer";
import {MeetingEffects} from "./+state/meeting/meeting.effects";
import {MEETING_FEATURE_KEY} from "./+state/meeting";

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
