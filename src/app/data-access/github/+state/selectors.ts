import {createSelector} from '@ngrx/store';
import {GitHubFeatureState, GitHubState} from './reducer';

export const selectGitHub = (globalState: GitHubFeatureState) =>  {
    return globalState.github;
};

export const selectGitHubList = createSelector(
    selectGitHub,
    (state: GitHubState) => state.list
);
