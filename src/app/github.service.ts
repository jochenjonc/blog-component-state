import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GitHubService {

    constructor(private http: HttpClient) {

    }

    getData(arg?:string) {
        const randId = (s: string) => s+'-'+~~(Math.random() * 10);
        return of(new Array(5)
            .fill(5)
            .map(_ => ({id: randId('id'), name: randId('name')})))
    }

}
