import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LocalState} from "@common";
import {delay, map, mergeMap, tap, withLatestFrom} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {concat, of, Subject} from "rxjs";
import {
    MeetingFeatureState,
    MeetingListItem,
    meetingPostSuccess,
    postMeeting,
    selectMeetings
} from "../../data-access/meetings";
import {Actions, ofType} from "@ngrx/effects";

interface Notification {
    id: string;
    title: string;
    type: 'information' | 'success' | 'error'
}

interface ComponentState {
    meetings: MeetingListItem[];
    notifications: { [id: string]: Notification };
}

@Component({
    selector: 'notification-container',
    template: `
        <h1>Meeting Container Component</h1>
        <button (click)="scheduleRandomMeeting.next($event)">
            Schedule Meeting
        </button>
        <meeting-list [meetings]="meetings$ | async">
        </meeting-list>
        notifications$: {{notifications$ | async | json}}
        notificationsMap$: {{notificationsMap$ | async | json}}
        <!--<div class="notification-overlay">
            <mat-card *ngFor="let n of notifications$ | async"
                      class="notification" [ngClass]="'information'" role="alert">
                {{n | json}}
            </mat-card>
        </div>-->
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: [],
    providers: [LocalState]
})
export class NotificationContainerComponent {
    initState: ComponentState = {notifications: {}, meetings: []};

    // UI-Actions
    scheduleRandomMeeting = new Subject<Event>();

    // View-State
    notificationsMap$ = this.vm.select();
    notifications$ = this.vm.select(
        map((s) => {
            return Object.entries(s.notifications)
                .reduce((arr, [key, value]) => [...arr, {key: key, value: value}], [])
        })
    );
    meetings$ = this.vm.select(map(s => s.meetings));

    //
    private meetingPostSuccess$ = this.actions$.pipe(
        ofType(meetingPostSuccess),
        map(a => a.meeting)
    );

    constructor(private store: Store<MeetingFeatureState>,
                private actions$: Actions,
                private vm: LocalState<ComponentState>) {


        this.vm.setState(this.initState);
        this.vm.connectState(this.store.select(selectMeetings)
            .pipe(map(m => ({meetings: m}))));

        this.vm.connectEffect(
            this.scheduleRandomMeeting.pipe(
                map(() => this.getMeeting()),
                tap(meeting => this.store.dispatch(postMeeting({meeting})))
            )
        );

        const createNotification$ = this.meetingPostSuccess$.pipe(
            map(
                meeting => {
                    const type = 'success';
                    const id = meeting.id + '-' + type;
                    const notification: Notification  = {
                        ...this.getNotification(id),
                        type
                    };
                    return notification;
                }
            )
        );

        this.vm.connectState(
            createNotification$
                .pipe(
                    withLatestFrom(this.notificationsMap$),
                    mergeMap(([notification, notifications]) => {
                        return of({
                            notifications: {
                                ...notifications,
                                [notification.id]: notification
                            }
                        })
                    })
                )
        )
    );

}

private
createNSBehaviour(cfg
:
{
    id ? : any, duration
:
    number
}
)
{
    return (m$) => {
        let id;
        return m$.pipe(
            tap(console.log),
            withLatestFrom(this.notificationsMap$),
            mergeMap(([meeting, notifications]) => {
                const type = 'success';
                id = meeting.id + '-' + type;
                const slice = {
                    notifications: {
                        ...notifications,
                        [id]: {
                            ...this.getNotification(id),
                            type
                        }
                    }
                };

                return concat(
                    of(slice),
                    of({notifications: {[id]: undefined}}).pipe(delay(cfg.duration)),
                )
            })
        );
    }
}

private
getMeeting(id ? : string)
:
MeetingListItem
{
    const dueDate = ~~(Date.now() / 1000) + 60;
    console.log('dueDate', dueDate);
    return {
        title: 'Meeting' + Math.random(),
        dueDate,
        id: id || ~~(Math.random() * 1000) + ''
    }
}

private
getNotification(id ? : string)
:
Notification
{
    const dueDate = ~~(Date.now() / 1000) + 60;
    console.log('dueDate', dueDate);
    return {
        type: 'information',
        title: 'Notification' + Math.random(),
        id: id || ~~(Math.random() * 1000) + ''
    }
}

}
