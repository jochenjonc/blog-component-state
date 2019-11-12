import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, mergeMap, map, switchMap} from 'rxjs/operators';

import {MeetingsService} from '../meetings.service';
import {
    fetchMeetingList,
    meetingListFetchError,
    meetingListFetchSuccess,
    meetingPostError,
    meetingPostSuccess,
    postMeeting
} from './actions';

@Injectable({
    providedIn: 'root'
})
export class MeetingEffects {

    fetchMeetings$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchMeetingList.type),
            switchMap(action =>
                this.meetingsService.getData(action).pipe(
                    map(meetings => meetingListFetchSuccess({meetings})),
                    catchError(error => of(meetingListFetchError({error})))
                )
            )
        )
    );

    postMeeting$ = createEffect(() =>
        this.actions$.pipe(
            ofType(postMeeting.type),
            mergeMap((action:any) =>
                //meetingPostSuccess({meeting: action.meeting.pop()})
                this.meetingsService.getData({num: action, data: action.meeting}).pipe(
                    map(meeting => meetingPostSuccess({meeting: meeting.pop()})),
                    catchError(error => of(meetingPostError({error})))
                )
            )
        )
    );

    constructor(private actions$: Actions, private meetingsService: MeetingsService) {

    }

}
