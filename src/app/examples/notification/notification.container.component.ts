import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {NotificationContainerAdapter} from "./notification.container.adapter";
import {NotificationContainerModel} from "./notification.container.model";
import {NotificationsContainerView} from "./notifications.container.view";
import {Meeting} from "@data-access/meetings";
import {map} from "rxjs/operators";
import {interval, timer} from "rxjs";

@Component({
    selector: 'notification-container',
    template: `
        <h1>Meeting Container Component {{time$ | async | date:'HH:mm:ss'}}</h1>
        <div class="mat-action-list">
            <button mat-raised-button color="primary"
                    (click)="scheduleRandomMeetingEvent.next($event)">
                Schedule Meeting
            </button>
            <button mat-raised-button color="primary"
                    (click)="refreshMeetingEvent.next($event)">
                Refresh List
            </button>
            <meeting-list [meetings]="meetings$ | async" [fetchPending]="fetchPending$ | async">
            </meeting-list>
        </div>
        <div class="notification-overlay">
            <mat-card *ngFor="let n of notifications$ | async"
                      class="notification" [ngClass]="n.type" role="alert">
                {{n.title}}
            </mat-card>
        </div>
        <!-- -->
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./notification.container.component.scss'],
    providers: [NotificationContainerAdapter, NotificationContainerModel]
})
export class NotificationContainerComponent implements NotificationsContainerView {
    time$ = timer(0, 1000).pipe(map(_ => Date.now()));
    // UI-Actions
    scheduleRandomMeetingEvent = this.a.scheduleRandomMeetingEvent;
    refreshMeetingEvent = this.a.refreshMeetingEvent;
    // View-State
    notifications$ = this.a.notifications$;
    meetings$ = this.a.meetings$.pipe(map(this.parseMeetings));
    fetchPending$ = this.a.fetchPending$;

    constructor(private a: NotificationContainerAdapter) {
    }

    parseMeetings(meetings: Meeting[]): Meeting[] {
        return meetings.map(m => {
            m.dueDateTimeStamp = m.dueDateTimeStamp * 1000;
            return m;
        });
    }

}
