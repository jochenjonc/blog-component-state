import {Observable, Subject} from "rxjs";
import {filter, startWith, tap} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {ISimpleListView} from "./simple-list.view.interface";
import {SimpleListModel} from "./simple-list.component.interface";
import {ISimpleListViewModel} from "./simple-list.view-model.interface";

@Injectable()
export class SimpleListViewModel implements ISimpleListView {
    // Data from Model (CONTRACT?)
    viewModelSubject: Subject<ISimpleListViewModel> = new Subject();

    // ISimpleListViewModel ============================================
    // Initial view config
    initModel: ISimpleListViewModel = {
        listClosed: false,
        list: []
    };

    // Derive ViewModel from Model
    // Optional: Provide initial data to render in the view
    viewModelChanges: Observable<ISimpleListViewModel> = this.viewModelSubject
        .pipe(
            filter<ISimpleListViewModel>(this.isViewModel),
            startWith(this.initModel),
        );

    // IListView =================================================

    // Listener for button click events
    refreshClicks  = new Subject<Event>();

    constructor() {

    }
    //  Formatting (model to other shape) =========================================
    // Parsing (other shape to model shape)========================================
    // Filter =====================================================================
    isViewModel(cfg: ISimpleListViewModel | any): boolean {
        const isArray = (obj) => (Object.prototype.toString.call(obj) === "[object Array]");
        return (cfg &&
            'list' in cfg && isArray(cfg.list));
    }

}


