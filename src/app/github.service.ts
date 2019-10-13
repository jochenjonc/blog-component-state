import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GitHubService {

    constructor(private http: HttpClient) {

    }

    getData(arg) {
        return of([
            {id: 1, name: 'one'},
            {id: 2, name: 'two'},
            {id: 3, name: 'three'},
            {id: 4, name: 'four'},
            {id: ~~(Math.random() * 10), name: 'random' + ~~(Math.random() * 10)}
        ])
    }

}
