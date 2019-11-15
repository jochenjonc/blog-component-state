import {Injectable} from '@angular/core';
import {LoggerService} from "@common";

@Injectable({providedIn: 'root'})
export class TimingGlobalService {

    constructor(private logger: LoggerService) {
        this.log({hook: "constructor"});
    }
    log(data) {
            this.logger.log({
                creatorInstance: 'TimingGlobalService',
                creator: "service",
                msg: "TimingGlobalService",
                ...data
            });
    }
    ngOnDestroy() {
        this.log({hook: 'ngOnDestroy'});
    }
}
