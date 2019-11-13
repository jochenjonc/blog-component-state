import {Injectable} from "@angular/core";
import {createUnsortedStateAdapter, LocalState} from "@common";
import {concat, EMPTY, Observable, Subject} from "rxjs";
import {concatMap, delay, map, mergeMap, take, tap} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {Actions, ofType} from "@ngrx/effects";
import {EntityState} from "@ngrx/entity";
import * as fromMeeting from "../../data-access/meetings";
import {MeetingNotification} from "./interfaces";
import {fetchMeetingList} from "../../data-access/meetings";

interface INotificationContainerModel {
    notifications: EntityState<MeetingNotification>;
    meetings:  fromMeeting.Meeting[]
}

@Injectable()
export class NotificationContainerModel extends LocalState<INotificationContainerModel> {
    private initState: INotificationContainerModel = {
        notifications: {
            ids: [],
            entities: {}
        },
        meetings:[]
    };

    //
    private meetingPostSuccess$ = this.actions$.pipe(
        ofType(fromMeeting.meetingPostSuccess), map(a => a.meeting)
    );
    private meetingPostError$ = this.actions$.pipe(
        ofType(fromMeeting.meetingPostError)
    );
    scheduleRandomMeeting = new Subject<any>();

    notifications$ = this.select(map(s => s.notifications));
    private notificationsAdapter = createNotificationAdapter(this.notifications$);

    constructor(private store: Store<fromMeeting.MeetingFeatureState>,
                private actions$: Actions) {
        super();
        this.fetchMeetings();

        this.select().subscribe(console.log);
        this.store.select(fromMeeting.selectMeetingFeature);
        this.store.select(fromMeeting.selectAllMeetings)
            .pipe(map(meetings => ({meetings}))).subscribe(console.log);

        this.setState(this.initState);

        this.connectState(this.store.select(fromMeeting.selectAllMeetings)
            .pipe(map(meetings => ({meetings}))));

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

        this.connectEffect(
            this.scheduleRandomMeeting.pipe(
                map(() => this.getMeeting()),
                tap(meeting => this.store.dispatch(fromMeeting.postMeeting({meeting})))
            )
        );


    }

    fetchMeetings(): void {
        console.log('fetchMeetings');
        this.store.dispatch(fetchMeetingList({}));
    }

    private getMeeting(id ?: string): fromMeeting.Meeting {
        const dueDate = ~~(Date.now() / 1000) + 60;
        return {
            title: 'Meeting' + Math.random(),
            dueDate,
            id: id || ~~(Math.random() * 1000) + ''
        }
    }

    private getNotificationFromMeeting(meeting, type) {
        const id = meeting.id + '-' + type;
        return this.getNotification({id, type});
    }

    private getNotification(data: Partial<MeetingNotification>): MeetingNotification {
        const dueDate = ~~(Date.now() / 1000) + 60;
        const id = data.id || ~~(Math.random() * 1000) + '';
        delete data.id;
        return {
            title: 'Notification' + Math.random(),
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
    const removeNotification = (notification) => notifications$.pipe(
        map(notifications => ({
            notifications: notificationsAdapter
                .removeOne(notification.id, notifications)
        })),
        take(1)
    );

    return {
        addNotification,
        removeNotification
    }

}
