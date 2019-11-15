import {Injectable} from "@angular/core";
import {createUnsortedStateAdapter, LocalState} from "@common";
import {concat, EMPTY, merge, Observable, pipe, Subject} from "rxjs";
import {concatMap, delay, map, mergeMap, take, tap} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {Actions, ofType} from "@ngrx/effects";
import {EntityState} from "@ngrx/entity";
import * as fromMeeting from "../../data-access/meetings";
import {MeetingNotification} from "./interfaces";
import {fetchMeetingList, Meeting, meetingListFetchError, meetingListFetchSuccess} from "../../data-access/meetings";
import {fetchRepositoryList, repositoryListFetchError, repositoryListFetchSuccess} from "@data-access/github";

interface INotificationContainerModel {
    notifications: EntityState<MeetingNotification>;
    meetings:  fromMeeting.Meeting[];
    fetchPending: boolean;

}

@Injectable()
export class NotificationContainerModel extends LocalState<INotificationContainerModel> {
    private initState: INotificationContainerModel = {
        notifications: {
            ids: [],
            entities: {}
        },
        meetings:[],
        fetchPending: false
    };

    //
    private meetingPostSuccess$ = this.actions$.pipe(
        ofType(fromMeeting.meetingPostSuccess), map(a => a.meeting)
    );
    private meetingPostError$ = this.actions$.pipe(
        ofType(fromMeeting.meetingPostError)
    );

    notifications$ = this.select(map(s => s.notifications));

    private notificationsAdapter = createNotificationAdapter(this.notifications$);


    scheduleRandomMeeting = new Subject<any>();

    constructor(private store: Store<fromMeeting.MeetingFeatureState>,
                private actions$: Actions) {
        super();

        this.store.select(fromMeeting.selectMeetingFeature);
        this.store.select(fromMeeting.selectAllMeetings)
            .pipe(map(meetings => ({meetings}))).subscribe(console.log);

        this.setState(this.initState);

        this.connectState(this.actions$.pipe(
                ofType(fetchMeetingList, meetingListFetchSuccess, meetingListFetchError),
                map(a => ({fetchPending: a.type === fetchMeetingList.type}))
            ));

        this.connectState(this.store.select(fromMeeting.selectAllMeetings)
            .pipe(map(meetings => ({meetings}))));

        this.connectEffect(
            this.scheduleRandomMeeting.pipe(
                map(() => this.getMeeting()),
                tap(meeting => this.store.dispatch(fromMeeting.postMeeting({meeting})))
            )
        );

        this.connectState(
            this.meetingPostSuccess$
                .pipe(
                    map(m => this.getNotificationFromMeeting(m, 'success')),
                    mergeMap(notification =>
                        concat(
                            this.notificationsAdapter.addNotification(notification),
                            EMPTY.pipe(delay(2000)),
                            this.notificationsAdapter.removeNotification(notification),
                        )
                    )
                )
        );

        this.connectState(
            this.meetingPostError$
                .pipe(
                    map(a => this.getNotificationFromMeeting(a.meeting, 'error')),
                    concatMap(notification =>
                        concat(
                            this.notificationsAdapter.addNotification(notification),
                            EMPTY.pipe(delay(2000)),
                            this.notificationsAdapter.removeNotification(notification),
                        )
                    )
                )
        );

        // Meeting Reminders
        this.connectState(
            this.meetingPostSuccess$
                .pipe(
                    mergeMap(meeting => {
                        const fadeOutDelay = EMPTY.pipe(delay(2500));
                        const updatePeriod = EMPTY.pipe(delay(5000));
                        const timeOfFirstNotification = new Date(meeting.dueDateTimeStamp  * 1000);
                        timeOfFirstNotification.setSeconds(timeOfFirstNotification.getSeconds()-15);

                        const remindUser = [
                            // Show - Meeting in 5 Sec
                            this.notificationsAdapter.upsertNotification(this.getReminderNotification(meeting)),
                            // Hide - Message after n Sec
                            fadeOutDelay,
                            this.notificationsAdapter.removeNotification(this.getReminderNotification(meeting)),
                        ];

                        return concat(
                            EMPTY.pipe(delay(timeOfFirstNotification)),
                            // Show - Meeting in 15 Sec
                            ...remindUser,
                            updatePeriod,

                            // Show - Meeting in 10 Sec
                            ...remindUser,
                            updatePeriod,

                            // Show - Meeting in 5 Sec
                            ...remindUser,
                            updatePeriod,

                            // Show - Meeting Now
                            this.notificationsAdapter.upsertNotification(this.getAlertNotification(meeting)),
                            fadeOutDelay,
                            // Show - Meeting Now
                            this.notificationsAdapter.removeNotification(this.getAlertNotification(meeting))
                        );
                    })
                )
        );

    }

    fetchMeetings(): void {
        this.store.dispatch(fetchMeetingList({}));
    }

    private getMeeting(id ?: string): fromMeeting.Meeting {
        const dueDate = ~~(Date.now() / 1000) + 30;
        return {
            title: 'M' + id,
            dueDateTimeStamp: dueDate,
            id: id || ~~(Math.random() * 100) + ''
        }
    }

    private getNotificationFromMeeting(meeting, type): MeetingNotification {
        const id = meeting.id + '-' + type;
        return this.getNotification({id, type, title: type === 'error' ? 'Create Error' : 'Create Success'});
    }
    private getReminderNotification(meeting: Meeting): MeetingNotification {
        const type = 'information';
        const id = meeting.id + '-' + type;
        const remainingSeconds = ~~(meeting.dueDateTimeStamp - Date.now() / 1000);
        return this.getNotification({id, type, title: `Starts in ${remainingSeconds}s!`});
    }
    private getAlertNotification(meeting: Meeting): MeetingNotification {
        const type = 'error';
        const id = meeting.id + '-' + type;
        const remainingSeconds = Date.now() / 1000 - meeting.dueDateTimeStamp;
        return this.getNotification({id, type, title: `${meeting.title} starts now!`});
    }

    private getNotification(data: Partial<MeetingNotification>): MeetingNotification {
        const id = data.id || ~~(Math.random() * 100) + '';
        delete data.id;
        return {
            title: 'Notification',
            type: 'information',
            ...data,
            id
        }
    }

}

export function createNotificationAdapter(notifications$: Observable<EntityState<MeetingNotification>>) {
    const notificationsAdapter = createUnsortedStateAdapter<MeetingNotification>((model: MeetingNotification) => model.id);

    const addNotification = (notification) => notifications$.pipe(
        map(notifications => ({
            notifications: notificationsAdapter
                .addOne(notification, notifications)
        })),
        take(1)
    );

    const upsertNotification = (notification) => notifications$.pipe(
        map(notifications => ({
            notifications: notificationsAdapter
                .upsertOne(notification, notifications)
        })),
        take(1)
    );

    const removeNotification = (notification) => notifications$.pipe(
        map(notifications => ({
            notifications: notificationsAdapter
                .removeOne(notification.id, notifications)
        })),
        take(1)
    );

    return {
        addNotification,
        upsertNotification,
        removeNotification
    }

}
