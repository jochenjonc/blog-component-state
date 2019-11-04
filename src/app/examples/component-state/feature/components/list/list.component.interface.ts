import {Subscribable} from "rxjs";
import {ListConfig} from "./list.view-model";

export interface IListComponent {
    // @Input bindings
    config: ListConfig;
    // @Output bindings
    selectedItemIdsChange: Subscribable<string[]>;
    refreshClick: Subscribable<Event>
}
