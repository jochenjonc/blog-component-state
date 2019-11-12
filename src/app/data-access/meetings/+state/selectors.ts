import {createSelector} from '@ngrx/store';
import {MEETING_FEATURE_KEY, MeetingFeatureState, MeetingState} from './reducer';

export const selectMeeting = (globalState: MeetingFeatureState) =>  {
    return globalState[MEETING_FEATURE_KEY];
};

export const selectMeetings = createSelector(
    selectMeeting,
    (state: MeetingState) => state.meetings
);
