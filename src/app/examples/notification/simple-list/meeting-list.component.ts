import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {ReplaySubject} from "rxjs";
import {MeetingListItem} from "@data-access/meetings";

@Component({
    selector: 'meeting-list',
    templateUrl: './meeting-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MeetingList {
    meetings$ = new ReplaySubject<MeetingListItem[]>();
    @Input()
    set meetings(meetings: MeetingListItem[]) {
        if(meetings) {
            this.meetings$.next(meetings);
        }
    }

    constructor() {
    }
}
