import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {ReplaySubject} from "rxjs";
import {Meeting} from "@data-access/meetings";

@Component({
    selector: 'meeting-list',
    templateUrl: './meeting-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MeetingList {
    meetings$ = new ReplaySubject<Meeting[]>(1);

    @Input()
    set meetings(meetings: Meeting[]) {
        if (meetings) {
            this.meetings$.next(meetings);
        }
    }

    fetchPending$ = new ReplaySubject<boolean>(1);

    @Input()
    set fetchPending(fetchPending: boolean) {
        this.fetchPending$.next(fetchPending);
    }

    constructor() {
    }
}
