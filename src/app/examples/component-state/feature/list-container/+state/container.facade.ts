import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {ComponentStateService} from '../../../../../common/component-state.service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {fetchRepositoryList, selectGitHubList} from '@data-access/github';
import {ListContainerAdapter, ListContainerState} from "./list.container.adapter.interface";
import {selectListConfig} from "./list-config.selectors";

@Injectable({
    providedIn: 'root'
})
export class ContainerFacade extends ComponentStateService<ListContainerState> implements ListContainerAdapter  {

    constructor(private ngRxStore: Store<any>) {
        super();
        // Analogy to register feature store in @ngrx/store
        this.connectSlices({list: this.ngRxStore.select(selectGitHubList)});
    }

    serverUpdateOn<T>(o: Observable<T>) {
        this.connectEffects({
            loadListEffect: o.pipe(tap(_ => this.ngRxStore.dispatch(fetchRepositoryList({}))))
        });
    }

}
