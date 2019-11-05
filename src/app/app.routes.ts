import {ROUTES as COLD_COMPOSITION_ROUTES} from "./examples/cold-composition/cold-composition.module";
import {ROUTES as LATE_SUBSCRIBER_ROUTES} from "./examples/late-subscriber/late-subscriber.module";
import {ROUTES as TIMING_ROUTES} from "./examples/timing/timing.module";
import {ROUTES as SUBSCRIPTION_HANDLING_ROUTES} from "./examples/subscription-handling/subscription-handling.module";
import {ROUTES as PROCESS_OVERRIDE_SLICE_ROUTES} from "./examples/process-override-slice/process-override-slice.module";
import {ROUTES as SHARING_A_REFERENCE_ROUTES} from "./examples/sharing-a-reference/sharing-a-reference.module";
import {ROUTES as DECLARATIVE_INTERACTION_ROUTES} from "./examples/declarative-interaction/declarative-interaction.module";
import {ROUTES as LOW_LEVEL_STATE_ROUTES} from "./examples/low-level-component-state/low-level-component-state.module";
import {ROUTES as STATE_INIT_CLEANUP_ROUTES} from "./examples/state-init-and-cleanup/state-init-and-cleanup.module";
import {ROUTES as ARCHITECTURE_ROUTES} from "./examples/architecture/architecture.module";

export const ROUTES = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'timing'
    },
    {path: 'timing', children: TIMING_ROUTES},
    {path: 'subscription-handling', children: SUBSCRIPTION_HANDLING_ROUTES},
    {path: 'late-subscriber', children: LATE_SUBSCRIBER_ROUTES},
    {path: 'sharing-a-reference', children: SHARING_A_REFERENCE_ROUTES},
    {path: 'cold-composition', children: COLD_COMPOSITION_ROUTES},
    {path: 'declarative-interaction', children: DECLARATIVE_INTERACTION_ROUTES},
    {path: 'low-level-component-state', children: LOW_LEVEL_STATE_ROUTES},
    {path: 'state-init-cleanup', children: STATE_INIT_CLEANUP_ROUTES},
    {path: 'process-override-slice', children: PROCESS_OVERRIDE_SLICE_ROUTES},
    {path: 'architecture', children: ARCHITECTURE_ROUTES}
];
