import { createSelector } from '@ngrx/store';
import { GitHubState } from './reducer';
 
export interface AppState {
  gtihub: GitHubState;
}
 
export const selectGitHub = (state: AppState) => state.gtihub;
 
export const selectGitHubList = createSelector(
  selectGitHub,
  (state: GitHubState) => state.list
);