import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import {Meeting} from "./meeting.model";

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
    props<{ meetings: Meeting[] }>()
);

export const postMeeting = createAction(
    '[Meeting List] Post',
    props<{ meeting: Meeting }>()
);
export const meetingPostError = createAction(
    '[Meeting] PostError',
    props<{ error: string; meeting: Meeting }>()
);
export const meetingPostSuccess = createAction(
    '[Meeting] PostSuccess',
    props<{ meeting: Meeting }>()
);


export const loadMeetings = createAction(
  '[Meeting/API] Load Meetings',
  props<{ meetings: Meeting[] }>()
);

export const addMeeting = createAction(
  '[Meeting/API] Add Meeting',
  props<{ meeting: Meeting }>()
);

export const upsertMeeting = createAction(
  '[Meeting/API] Upsert Meeting',
  props<{ meeting: Meeting }>()
);

export const addMeetings = createAction(
  '[Meeting/API] Add Meetings',
  props<{ meetings: Meeting[] }>()
);

export const upsertMeetings = createAction(
  '[Meeting/API] Upsert Meetings',
  props<{ meetings: Meeting[] }>()
);

export const updateMeeting = createAction(
  '[Meeting/API] Update Meeting',
  props<{ meeting: Update<Meeting> }>()
);

export const updateMeetings = createAction(
  '[Meeting/API] Update Meetings',
  props<{ meetings: Update<Meeting>[] }>()
);

export const deleteMeeting = createAction(
  '[Meeting/API] Delete Meeting',
  props<{ id: string }>()
);

export const deleteMeetings = createAction(
  '[Meeting/API] Delete Meetings',
  props<{ ids: string[] }>()
);

export const clearMeetings = createAction(
  '[Meeting/API] Clear Meetings'
);
