import {createAction, props} from '@ngrx/store';
import {MeetingListItem} from "./meeting-list.model";

export const fetchMeetingList = createAction(
    '[Meeting List] Fetch',
    props<{ params?: { from: string, to: string } }>()
);
export const meetingListFetchError = createAction(
    '[Meeting List] FetchError',
    props<{ error: string }>()
);
export const meetingListFetchSuccess = createAction(
    '[Meeting List] FetchSuccess',
    props<{ meetings: MeetingListItem[] }>()
);


export const postMeeting = createAction(
    '[Meeting List] Post',
    props<{ meeting: MeetingListItem }>()
);
export const meetingPostError = createAction(
    '[Meeting List] PostError',
    props<{ error: string }>()
);
export const meetingPostSuccess = createAction(
    '[Meeting List] PostSuccess',
    props<{ meeting: MeetingListItem }>()
);
