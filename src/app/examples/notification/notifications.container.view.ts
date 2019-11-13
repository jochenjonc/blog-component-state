import {Meeting} from "@data-access/meetings";
import {Observable, Subject} from "rxjs";
import {MeetingNotification} from "./interfaces";

export interface NotificationsContainerView {
    meetings$: Observable<Meeting[]>;
    notifications$: Observable<MeetingNotification[]>;
    scheduleRandomMeetingEvent: Subject<Event>;
    refreshMeetingEvent: Subject<Event>;
}
