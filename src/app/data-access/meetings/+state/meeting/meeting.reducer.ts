import {Action, createReducer, createSelector, on} from '@ngrx/store';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Meeting} from './meeting.model';
import * as MeetingActions from './meeting.actions';

export const MEETING_FEATURE_KEY = 'meetings';
export interface MeetingFeatureState {
  [MEETING_FEATURE_KEY]: EntityState<Meeting>
}

export interface State extends EntityState<Meeting> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Meeting> = createEntityAdapter<Meeting>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const meetingReducer = createReducer(
  initialState,
  on(MeetingActions.addMeeting,
    (state, action) => adapter.addOne(action.meeting, state)
  ),
  on(MeetingActions.upsertMeeting,
    (state, action) => adapter.upsertOne(action.meeting, state)
  ),
  on(MeetingActions.addMeetings,
    (state, action) => adapter.addMany(action.meetings, state)
  ),
  on(MeetingActions.upsertMeetings,
    (state, action) => adapter.upsertMany(action.meetings, state)
  ),
  on(MeetingActions.updateMeeting,
    (state, action) => adapter.updateOne(action.meeting, state)
  ),
  on(MeetingActions.updateMeetings,
    (state, action) => adapter.updateMany(action.meetings, state)
  ),
  on(MeetingActions.deleteMeeting,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(MeetingActions.deleteMeetings,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(MeetingActions.loadMeetings,
    (state, action) => adapter.addAll(action.meetings, state)
  ),
  on(MeetingActions.clearMeetings,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return meetingReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectMeetingFeature = (globalState: MeetingFeatureState) =>  {
  return globalState[MEETING_FEATURE_KEY];
}

export const selectAllMeetings = createSelector(
    selectMeetingFeature,
    (s) => selectAll(s)
);
