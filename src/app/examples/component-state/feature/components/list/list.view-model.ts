import {defer, Observable, Subject} from "rxjs";
import {ListConfig, selectedIds} from "./list.view-model.interface";
import {isArray} from "../../../utils";
import {filter, map, shareReplay, switchMap} from "rxjs/operators";
import {FormBuilder, FormGroup} from "@angular/forms";
import {FormGroupConfig} from "./list.component";
import {Injectable} from "@angular/core";
import {RepositoryListItemModel} from "@data-access/github";


export type selectedIds = string[];

export interface ListConfig {
    list: RepositoryListItemModel[],
    selectedItemIds: selectedIds
}

export interface IListViewModel {
    // config getter is Observable
    readonly configSubjectO: Subject<ListConfig>;
    readonly configO: Observable<ListConfig>;
    readonly selectedItemIds: Observable<selectedIds>
}

/*
* MVVM implements:
* // state of the view
* - config: Observable<ListConfig>
* - selectedItemIds: Observable<string[]>
* - refreshTrigger: Observable<Event>
* // methods that implement login of view
*   i.e. `onRefreshClick(e: Event): void`
*
* No coupling to Angular
* */
@Injectable({
    providedIn: 'root'
})
export class ListViewModel implements IListViewModel {
    fb: FormBuilder;

    // Link input binding of Component to ViewModel
    configSubjectO: Subject<ListConfig> = new Subject<ListConfig>();
    configO: Observable<ListConfig> = defer(() => this.configSubjectO
        .pipe(
            filter<ListConfig>(this.isListConfig)
        ));

    formO: Observable<FormGroup> = this.configO
        .pipe(
            // instantiate form
            map(cfg => this.fb.group(this.formatFormConfig(cfg))),
            // make formGroup singleton
            shareReplay(1)
        );

    // Link state changes of ViewModel to Component
    selectedItemIds: Observable<selectedIds> = this.formO.pipe(
        switchMap(f => f.valueChanges),
        map(this.parseSelectedIds)
    );

    // Template related section

    // Used to sort list by id ====================================================
    getId(item) {
        return item.id
    }

    // Filter =====================================================================

    isListConfig(cfg: ListConfig | any): boolean {
        return (cfg &&
            'list' in cfg && isArray(cfg.list) &&
            'selectedItemIds' in cfg && isArray(cfg.selectedItemIds));
    }

    //  Formatting (model to other shape) =========================================

    parseSelectedIds(fGM: {[key: string]: boolean}) {
        return Object.entries(fGM).filter(a => a[1]).map(a => a[0] + '')
    }

    // Parsing (other shape to model shape)========================================

    // get key/value mpa of selected items {[itemId: string]: [boolean]}
    formatFormConfig(cfg: ListConfig): FormGroupConfig {
        return cfg.list
            .reduce((acc, i) => ({...acc, [i.id]: cfg.selectedItemIds.indexOf(i.id) !== -1}), {})
    }
}



