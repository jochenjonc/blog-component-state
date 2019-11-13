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
    meetings$ = new ReplaySubject<Meeting[]>();
    @Input()
    set meetings(meetings: Meeting[]) {
        if(meetings) {
            this.meetings$.next(meetings);
        }
    }

    constructor() {
    }
}
