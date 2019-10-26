import {ROUTES as COLD_COMPOSITION_ROUTES} from "./cold-composition/cold-composition.module";
import {ROUTES as LATE_SUBSCRIBER_ROUTES} from "./late-subscriber/late-subscriber.module";
import {ROUTES as COMPONENT_STATE_ROUTES} from "./component-state/component-state.module";
import {ROUTES as TIMING_ROUTES} from "./timing/timing.module";
import {ROUTES as SUBSCRIPTION_HANDLING_ROUTES} from "./subscription-handling/subscription-handling.module";
import {ROUTES as PROCESS_OVERRIDE_SLICE_ROUTES} from "./process-override-slice/process-override-slice.module";
import {ROUTES as SHARING_A_REFERENCE_ROUTES} from "./sharing-a-reference/sharing-a-reference.module";
import {ROUTES as DECLARATIVE_INTERACTION_ROUTES} from "./declarative-interaction/declarative-interaction.module";
import {ROUTES as LOW_LEVEL_STATE_ROUTES} from "./low-level-component-state/low-level-component-state.module";

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
    {path: 'process-override-slice', children: PROCESS_OVERRIDE_SLICE_ROUTES},
    {path: 'component-state', children: COMPONENT_STATE_ROUTES},
    {path: 'sharing-a-reference', children: SHARING_A_REFERENCE_ROUTES},
    {path: 'declarative-interaction', children: DECLARATIVE_INTERACTION_ROUTES},
    {path: 'low-level-component-state', children: LOW_LEVEL_STATE_ROUTES},

];
