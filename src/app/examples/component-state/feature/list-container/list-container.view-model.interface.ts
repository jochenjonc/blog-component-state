import {ListConfig} from "../components/list/list-config.interface";
import {Observable} from "rxjs";


export interface ListContainerViewModel {
    listConfig: Observable<ListConfig>

}


