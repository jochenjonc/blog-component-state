import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, mergeMap, switchMap, tap} from 'rxjs/operators';

import {MeetingsService} from '../../meetings.service';
import {
    addMeetings,
    fetchMeetingList,
    meetingListFetchError,
    meetingListFetchSuccess,
    meetingPostError,
    meetingPostSuccess,
    postMeeting
} from "./meeting.actions";

@Injectable({
    providedIn: 'root'
})
export class MeetingEffects {

    fetchMeetings$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchMeetingList.type),
            switchMap(action =>
                this.meetingsService.getData().pipe(
                    mergeMap(meetings => [
                        meetingListFetchSuccess({meetings}),
                        addMeetings({meetings})
                    ]),
                    catchError(error => {
                        console.log(error);
                        return of(meetingListFetchError({error}))
                    })
                )
            )
        )
    );

    postMeeting$ = createEffect(() =>
        this.actions$.pipe(
            ofType(postMeeting.type),
            mergeMap((action: any) =>
                this.meetingsService.getData({num: 1, data: action.meeting}).pipe(
                    tap(meetings => {
                        if (Math.random() < 0.1) {
                            throw new Error('Meeting create error')
                        }
                    }),
                    mergeMap(meetings => [
                            meetingPostSuccess({meeting: meetings[0]}),
                            addMeetings({meetings})
                        ]),
                    catchError(error => of(meetingPostError({error, meeting: action.meeting})))
                )
            )
        )
    );

    constructor(private actions$: Actions, private meetingsService: MeetingsService) {

    }

}
