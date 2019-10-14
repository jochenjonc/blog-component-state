import {ROUTES as COLD_COMPOSITION_ROUTES} from "./cold-composition/cold-composition.module";
import {ROUTES as LATE_SUBSCRIBER_ROUTES} from "./late-subscriber/late-subscriber.module";
import {ROUTES as COMPONENT_STATE_ROUTES} from "./component-state/component-state.module";
import {ROUTES as TIMING_ROUTES} from "./timing/timing.module";
import {ROUTES as SUBSCRIPTION_HANDLING_ROUTES} from "./subscription-handling/subscription-handling.module";

export const ROUTES = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'timing'
    },
    {path: 'timing', children: TIMING_ROUTES},
    {path: 'subscription-handling', children: SUBSCRIPTION_HANDLING_ROUTES},
    {path: 'late-subscriber', children: LATE_SUBSCRIBER_ROUTES},
    {path: 'cold-composition', children: COLD_COMPOSITION_ROUTES},
    {path: 'component-state', children: COMPONENT_STATE_ROUTES}
];
