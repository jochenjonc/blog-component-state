import {Injectable} from '@angular/core';
import {Observable, timer} from 'rxjs';
import {map, tap} from "rxjs/operators";
import {Meeting} from "./+state/meeting/meeting.model";

interface randomCfg {
    num: number;
    data: Meeting
}

@Injectable({
    providedIn: 'root'
})
export class MeetingsService {

    constructor() {
    }

    getData(cfg?: randomCfg): Observable<Meeting[]> {
        return timer(~~(Math.random() * 5000))
            .pipe(map(_ => getRandomMeetings(cfg)), tap(console.log));
    }
}

export function getRandomMeetings(cfg: randomCfg = {num: 5, data: {} as Meeting}): Meeting[] {
    const randId = (s: string) => s + ~~(Math.random() * 100);
    const dueDateTimeStamp = new Date();
    dueDateTimeStamp.setSeconds((dueDateTimeStamp.getSeconds() + 60));

    const data: Meeting[] = new Array(cfg.num || 1)
        .fill(null)
        .map(_ => ({
                id: randId('id'),
                title: randId('Title'),
                dueDateTimeStamp: dueDateTimeStamp.getTime() / 1000,
                ...cfg.data || {}
            })
        );
    return data;
}
