import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of, timer} from 'rxjs';
import {delay, map} from "rxjs/operators";
import {MeetingListItem} from "./+state/meeting-list.model";

interface randomCfg {
    num: number;
    data: MeetingListItem
}

@Injectable({
    providedIn: 'root'
})
export class MeetingsService {

    constructor(private http: HttpClient) {
    }

    getData = (cfg?: randomCfg) => timer(~~(Math.random()*5000)).pipe(map(_ => getRandomMeetings(cfg)));

}

export function getRandomMeetings(cfg: randomCfg = {num: 5, data: {} as MeetingListItem}): MeetingListItem[] {
    const randId = (s: string) => s + ~~(Math.random() * 100);
    const date = ~~(Date.now() / 1000)  + 60 * 60 ;
    return new Array(cfg.num)
        .fill(cfg.num)
        .map(_ => {
            return ({
                ...cfg.data,
                id: randId('id'),
                title: randId('Title'),
                dueDate: cfg.data.dueDate ? cfg.data.dueDate : date ,
                created: Date.now() + ''
            })
        });
}
