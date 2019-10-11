import { createReducer, on  } from '@ngrx/store';
import { listLoadedSuccess } from './actions';

export interface GitHubState {
  list: any[]
}

const _listReducer = createReducer(
  {list: [{id: 1, name: 'onee'}]}, 
  on(listLoadedSuccess, (state, action) => ({
    ...state, 
    list: uniteArrays(state.list, action.list)
    })
  )
);

export const listReducer = (state, action) => _listReducer(state, action);

function uniteArrays(...arrs: any[][]) {
  return  Array.from(
      new Map(
        arrs
          .reduce((arr, a) => arr.concat(a))
          .map(i => [i.id, i])
      )
      .entries()
  )
  .map(e => e[1])
}