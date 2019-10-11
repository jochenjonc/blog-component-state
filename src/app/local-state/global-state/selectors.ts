import { createSelector } from '@ngrx/store';
import { GitHubState } from './reducer';
 
export interface AppState {
  github: GitHubState;
}
 
export const selectGitHub = (state: AppState) => state.github;
 
export const selectGitHubList = createSelector(
  selectGitHub,
  (state: GitHubState) => state.list
);