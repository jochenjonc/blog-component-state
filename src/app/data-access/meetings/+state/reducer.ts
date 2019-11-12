import {createReducer, on} from '@ngrx/store';
import {meetingListFetchSuccess, meetingPostSuccess} from "./actions";
import {MeetingListItem} from "./meeting-list.model";
import {getRandomMeetings} from "../meetings.service";

export const MEETING_FEATURE_KEY = 'meeting';

export interface MeetingState {
    users: [],
    meetings: MeetingListItem[]
}

const initialMeetingState: MeetingState = {
    meetings: getRandomMeetings(),
    users: []
};

export interface MeetingFeatureState {
    [MEETING_FEATURE_KEY]: MeetingState
}

const _meetingReducer = createReducer(
    initialMeetingState,
    on(meetingListFetchSuccess, (state, action) => ({
            ...state,
            meetings: uniteItemArrays(state.meetings, action.meetings)
        })
    ),
    on(meetingPostSuccess, (state, action) => ({
            ...state,
            meetings: state.meetings.concat([action.meeting])
        })
    )
);

export const meetingReducer = (state, action) => _meetingReducer(state, action);

function uniteItemArrays(...arrs: MeetingListItem[][]) {
    return Array.from(
        new Map(arrs
            .reduce((arr: any, a: any): any => arr.concat(a), [])
            .map(i => [i.id, i])
        ).entries()
    ).map(e => e[1])
}
