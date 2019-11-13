import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
    const dueDate = ~~(Date.now() / 1000) + 60 * 60;

    const data = new Array(cfg.num || 1)
        .fill(0)
        .map(_ => ({
                id: randId('id'),
                title: randId('Title'),
                dueDate,
                created: Date.now() + '',
                ...cfg.data || {}
            })
        );
    return data;
}
