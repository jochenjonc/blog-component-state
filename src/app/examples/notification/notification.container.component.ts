import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {NotificationContainerAdapter} from "./notification.container.adapter";
import {NotificationContainerModel} from "./notification.container.model";
import {NotificationsContainerView} from "./notifications.container.view";

@Component({
    selector: 'notification-container',
    template: `
        <h1>Meeting Container Component</h1>
        <button mat-raised-button color="primary"
                (click)="scheduleRandomMeetingEvent.next($event)">
            Schedule Meeting
        </button>
        <button mat-raised-button color="primary"
                (click)="refreshMeetingEvent.next($event)">
            Refresh List
        </button>

        <meeting-list [meetings]="meetings$ | async">
        </meeting-list>

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

    // UI-Actions
    scheduleRandomMeetingEvent = this.a.scheduleRandomMeetingEvent;
    refreshMeetingEvent = this.a.refreshMeetingEvent;
    // View-State
    notifications$ = this.a.notifications$;
    meetings$ = this.a.meetings$;

    constructor(private a: NotificationContainerAdapter) {
    }

}
