import {map} from "rxjs/operators";
import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {NotificationContainerModel} from "./notification.container.model";
import {NotificationsContainerView} from "./notifications.container.view";
import {MeetingNotification} from "./interfaces";

@Injectable()
export class NotificationContainerAdapter implements NotificationsContainerView {

    // View-State
    notifications$ = this.m.select(map(s => Object.entries(s.notifications.entities)
        .map(([key, notification]): MeetingNotification => notification)));
    meetings$ = this.m.select(map(s => s.meetings));

    scheduleRandomMeetingEvent = new Subject<Event>();
    refreshMeetingEvent = new Subject<Event>();

    constructor(private m: NotificationContainerModel) {
        this.scheduleRandomMeetingEvent
            .subscribe(this.m.scheduleRandomMeeting);

    }

}
