import {EntityState} from "@ngrx/entity";
import {Meeting} from "@data-access/meetings";

export interface MeetingNotification {
    id: string;
    title: string;
    type: 'information' | 'success' | 'error'
}

export interface ComponentStat {
    meetings: Meeting[];
    notifications: EntityState<MeetingNotification>;
}
