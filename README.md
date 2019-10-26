# Problems in when managing component state with Angular

<!-- toc -->

- [Timing](#timing)
- [Subscription Handling](#subscription-handling)
- [The Late Subscriber Problem](#the-late-subscriber-problem)
- [Sharing references (SHOULD NOT BE SOLVE BY COMPONENT STATE)](#sharing-references-should-not-be-solve-by-component-state)
- [The Cold Composition Problem](#the-cold-composition-problem)
- [Imperative Interaction with Component StateManagement](#imperative-interaction-with-component-statemanagement)
- [Recap](#recap)
- [Dynamic Component State and Reactive Context](#dynamic-component-state-and-reactive-context)
  * [Initialisation and Cleanup](#initialisation-and-cleanup)
  * [Overriding State Changes and Effects](#overriding-state-changes-and-effects)

<!-- tocstop -->

# Timing

As a lot of problems I ran into while my consulting are related to timing issues, 
this section is here to give a quick overview of all the different types of issues and their reason.

Shouldn't FRP be by design timing independent?

I mean not that there is no time in observables, but when we compose observables we 
should not care about when any of our state sources exactly emits a value... 

In fact that's the case, in a perfect functional setup we don't need to care about those problems.
However, as Angular is an object orientated framework we have to often with different problems related to life-cycles of components and services, router-events and many more things.

In RxJS timing is give by the following:
- For hot observables the **time of creation**
- For cold observables the **time of subscription**
- For emitted values the **scheduling process**

In Angular timing is given by the following:
- For global services the **creation** as well as the application **life-time**
- For components the **creation**, several **life-cycle hooks** as well as the component **life-time**
- For local services the **creation** of the component as well as the components **life-time**
- For pipes oe directives in the template also the components **life-time**

All timing relates things in Angular are in object oriented style, very similar to hot observables.
Subscription handling can be done declarative over completion operators. 
The scheduling process can be controlled both over imperative or over operators and can influence the execution context of next error or complete callback.

We see that there are two different concepts combined that have completely different ways of dealing with timing. 
Angular already solved parts of this friction points but some of 
them are still left and we have to find the right spots to put our glue code and fix the problem.

![](https://github.com/BioPhoton/blog-component-state/raw/master/images/angular-timeline__michael-hladky.png "Angular Timeline")

This chart shows a minimal Angular app with the different building units ant their timing:  
In this example it marks:
- the global store lifetime
- the component store lifetime
- the async pipe lifetime

As we can see It makes a big difference where we place observables and where we subscribe to them. 
It also shows where we need hot observables and where we need to replay values.

# Subscription Handling

Let's discuss where subscriptions should take place and for which reason they are made.

Subscriptions are here to receive values from any source.

In most cases we want to render the incoming values.
For this reason we use a `Pipe` or a `Directive` in the template to trigger
change-detection whenever a value arrives.

The other reason could be to run some background tasks in a `Component`, `Directive` or `Service`,
which should not get rendered. I.e. a request to the server every 30 seconds.

As subscriptions in the `Pipe` or `Directive` are handled over their life-cycle
hooks automatically, we only have to discuss the scenarios for side-effects.

```typescript
@Component({
  ...
})
export class SubscriptionHandlingComponent implements OnDestroy {
    onDestroy$ = new Subject();

    sideEffect$ = timer(0, 1000).pipe(tap(n => serverRequest(n)));

    constructor() {
        this.sideEffect$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe();
    }

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
    }
}
```

We already have a declarative subscription handling. 
But this code could get abstracted way. We could use
the local service that we most probably will need if we implement
the final implementation for component state handling.

**Service**
```typescript
export class SubscriptionHandlingService implements OnDestroy {

    onDestroy$ = new Subject();

    subscribe(o): void {
        o.pipe(takeUntil(this.onDestroy$))
            .subscribe();
    }

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
    }

}
```

**Component**
```typescript
@Component({
    ...
    providers: [SubscriptionHandlingService]
})
export class SubscriptionHandlingComponent {
    sideEffect$ = timer(0, 1000)
        .pipe(tap(console.log));

    constructor(private subHandler: SubscriptionHandlingService) {
        this.subHandler
            .subscribe(this.sideEffect$)
    }
}
```

In this way we get rid of thinking about subscriptions in the component at all.

# The Late Subscriber Problem

![](https://github.com/BioPhoton/blog-component-state/raw/master/images/late-subscriber__michael-hladky.png "Late Subscriber")

Incoming values arrive before the subscription has happened.

For example state over `@Input()` decorators arrives before the view gets rendered and a used pipe could receive the value.

```typescript
@Component({
  selector: 'app-late-subscriber',
  template: `
    {{state$ | async | json}}
  `
})
export class LateSubscriberComponent {
  state$ = new Subject();
  
  @Input()
  set state(v) {
    this.state$.next(v);
  }

}
```

We call this situation late subscriber problem. In this case, the view is a late subscribe to the values from '@Input()' properties.
There are several situations from our previous explorations that have this problem:
- [Input Decorators](Input-Decorators)
  - transporting values from `@Input` to `AfterViewInit` hook
  - transporting values from `@Input` to the view
  - transporting values from `@Input` to the constructor 
- [Component And Directive Life Cycle Hooks](Component-And-Directive-Life-Cycle-Hooks)
  - transporting `OnChanges` to the view
  - getting the state of any life cycle hook later in time (important when hooks are composed)
- [Local State](Local-State)
  - transporting the current local state to the view
  - getting the current local state for other compositions

**Primitive Solution**

```typescript
@Component({
  selector: 'app-late-subscriber',
  template: `
    {{state$ | async | json}}
  `
})
export class LateSubscriberComponent {
  state$ = new ReplaySubject(1);
  
  @Input()
  set state(v) {
    this.state$.next(v);
  }

}
```

The downside here is that we can only replay the latest value emitted.  
Replaying more values would cause problems for later compositions of this stream,
as a new subscriber would get all past values of the `@Input` Binding. 
And that's not what we want.

Another downside is the bundle size of ShareReplay. 
But it will be used anyway somewhere in our architecture, so it's a general downside.

# Sharing references (SHOULD NOT BE SOLVE BY COMPONENT STATE) 

Let me front off explain that this section is here specifically to explain
why this problem **should not be part of the components state-management**.

To start this section let's discuss the components implementation details first.
We focus in the components outputs. 

```typescript
@Component({
    ...
})
export class AnyComponent {
    @Output() compOutput = new EventEmitter()
}
```

Let's take a closer look at EventEmitter interface:
`EventEmitter<T extends any> extends Subject<T>`
And `Subject` looks like this:
`Subject<T> extends Observable<T> implements SubscriptionLike`
The important part here is that we can pass everything that holds a `subscribe`.

Which means the following would work:

```typescript
@Component({
    ...
})
export class AnyComponent {
    @Output() compOutput = interval(1000);
}
```
An observable for example holds a subscribe method in it

With this in mind let's focus on the original problem, sharing a reference.

In this example we receive a config object from the parent and emit changes from the from created out of the config object.

Every time we receive a new value from the input binding 
- we create a config object out of it
- and use the `FormBuilder` service to create the new form.
As output value we have to provide something that holds a `subscribe` method.
So we could use the formGroups `valueChanges` to provide the forms changes directly as component output events.

```typescript
@Component({
    selector: 'sharing-a-reference',
    template: `
        <form *ngIf="(formGroup$ | async) as formGroup" [formGroup]="formGroup">
            <div *ngFor="let c of formGroup.controls | keyvalue">
                <label>{{c.key}}</label>
                <input [formControlName]="c.key"/>
            </div>
        </form>
    `
})
export class SharingAReferenceComponent {
    state$ = new ReplaySubject(1);

    formGroup$: Observable<FormGroup> = this.state$
        .pipe(
            startWith({}),
            map(input => this.getFormGroupFromConfig(input))
        );

    @Input()
    set formGroupModel(value) {
        this.state$.next(value);
    }

    @Output() formValueChange = this.formGroup$
        .pipe(switchMap((fg: FormGroup) => fg.valueChanges));

    constructor(private fb: FormBuilder) {

    }

    getFormGroupFromConfig(modelFromInput) {
        const config = Object.entries(modelFromInput)
            .reduce((c, [name, initialValue]) => ({...c, [name]: [initialValue]}), {});
        return this.fb.group(config);
    }

}
```

But the values are not updating in the parent component.
We forgot that our `formGroup$` observable ends with a `map` operator,
which returns is a uni-cast observable.

What happened is we subscribed once in the template over the `async` pipe to render the form.
And another time in the component internals to emit value changes from the form.

As `formGroup$` is uni-cast we created a new `FormGroup` instance for every subscription.

This can be solved by adding a multicast operator like `share` or `shareReplay` at the end of `formGroup$`.
As we also have late subscribers (`async` pipe in the template), we use `shareReplay` with `bufferSize` 1. 

```typescript
   formGroup$: Observable<FormGroup> = this.state$
        .pipe(
            startWith({}),
            map(input => this.getFormGroupFromConfig(input)),
            shareReplay(1)
        );
```
`shareReplay` emits **the same value** to subscribers.

So the subscription in the template and the subscription in the components internals receive **the same instance** of `FormGroup`.

Important to notice here is that `shareReplay` is cold but multicast. 
This means it only subscribes to the source if at least one subscriber is present.
This does not solve the problem of cold composition.

As this kind of problem nearly only to component internal instances it should not
be bart of the components state-management.
Also we never store references of class instances in the store as it takes away the whole idea of consistent, controlled state changes.

# The Cold Composition Problem

Let's quickly clarify hot/cold and uni-case/multi-cast.

**cold** 
Means the producer sits inside of the observable.
Whenever .subscribe is called the subscriber function fires and we create a new instance fo the producer.
i.e. the static `interval` gets created whenever we subscribe to it.

**hot**
Means the producer sits outside of the observable.
The producer emits values independent of the subscriber. If .subscribe is called we will receive all values from the moment of subscription on. 
The past values are not recognized.
i.e. the `@Input` binding is a hot producer
that sits outside of our `Subject` (extends `Observable`) and emits values independent of the moment when `async` pipe subscribes.

**uni-cast**
Means the producer is unique per subscription.
i.e. `fromEvent` is a uni-cast observable as we pass a
new function per subscription for the internal `.addEventListener` call.
And if we unsubscribe we remove only this function, and not the others.

**multi-cast**
Means there is one producer instance fol all subscription.
i.e. A subject that emits the values from a single producer to all subscriber.

With this in mind we can discuss the problem of cold composition.

If we compose state we have to consider that every operator returns cold observables.
(Multi-casting operators are not really operators as they are not compos-able)

So no matter what we do before, after an operation we get a cold observable.
I call this situation cold composition, as with selector functions in i.e. publish we are also able to create hot compositions.

Let's see an simple example where we compose different sources in a service:

**Service:**
```typescript
export class SomeService implements OnDestroy {
    // one channel for different requests for change
    commands$ = new Subject();
    composedState$ = this.commands$
        .pipe(
            scan((acc, i) => {
                return {sum : acc['sum'] + i['sum']};
            }, {sum: 0})
        );

    constructor(globalService: GlobalService) {
        // initial value from constant
        this.commands$.next({sum: 100});
        // initial value from other service
        this.commands$.next({sum: globalService.value});
    }

    ngOnDestroy(): void {
        this.commands$.complete();
    }

}
```

**Component:**
```typescript
@Component({
    selector: 'cold-composition-bad',
    template: `
        <h1>Cold Composition - Missing Values</h1>
        composedState$: {{someBadService.composedState$ | async | json}}
    `,
    providers: [SomeService]
})
export class ColdCompositionBadComponent implements OnDestroy {
 
    input$ = new Subject<number>();
    
    // Input gets updated every second with an incremental number (1,2,3,4,5,...)
    @Input()
    set inputValue(value: number) {
        this.input$.next(value);
    }

    constructor(public someBadService: SomeBadService) {
        // earliest possible moment to forward values
        this.input$.pipe(map(n => ({sum: n})))
            .subscribe(
                n => this.someBadService.commands$.next(n)
            );
         // earliest possible moment to subscribe to a service
         this.someBadService.composedState$.subscribe(s => console.log('composedState bad: ', s) );
    }

    ngOnDestroy(): void {
        this.input$.complete()
    }
}
```

If we run the code we would start out rendering with {sum: 1}.

The service is the first thing that gets initialised.
The initial commands are fired, but the initial values are fired before the component gets instantiated
and subscribes to the service. 

Even if the source is hot (the subject in the service is defined on instantiation) the composition made the stream cold again.
Which means the composed values can be received only if there is at least 1 subscriber. 
In our case the subscriber was the component constructor. 

Let's specify the problem first: 
Services are the things in Angular that are instantiated first.  
This means the component it self, independent from all lifecycle hooks is a late subscriber.  
This means if any composition is done in the service no matter if the sources are hot or cold, it can oly happen when the component subscribes.  

We can solve this problem in two ways: 
a) make all involved hot sources replay the [n] values (i.e. @Input with RelpaySubject)
b) make the composition hot in the service

As a) is not applicable at all and b) is more efficient we go with b)  

Let's see how we can implement this:

**Hot Composition Service:**
```typescript
import {Injectable, OnDestroy} from '@angular/core';
import {ConnectableObservable, Subject, Subscription} from 'rxjs';
import {publishReplay, scan} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class SomeService implements OnDestroy {
    serviceSubscription = new Subscription();

    commands$ = new Subject();
    composedState$ = this.commands$
        .pipe(
            scan((acc, i) => {
                return {sum : acc['sum'] + i['sum']};
            }, {sum: 0}),
            publishReplay(1)
        ) as ConnectableObservable;

    constructor() {
        // Composition is hot from here on
        this.serviceSubscription = this.composedState$.connect();

        // initial value from constant
        this.commands$.next({sum: 100});
        // initial value from other service
        this.commands$.next({sum: 25});
    }

    ngOnDestroy(): void {
        this.serviceSubscription.unsubscribe();
    }

}
```

We kept the component untouched and only applied changes to the service.

We used the `publishReplay` operator to make the
source replay the last emitted value.

In the service constructor we called `.connect` to make it hot (subscribe to the source).

# Imperative Interaction with Component StateManagement

So far we only had focused on independent peaces and didn't payed much attention on their interaction.
Let's analyze the way we interact with components and services:

Well known implementations of sate management like `@ngrx/store`,
which is a global state management library, implemented the consumer facing API in an imperative way.
The provided method is `dispatch` which accepts a single value that get sent to the store. 

Let's look at a simple example:

**Imperative Interaction Service**
```typescript
export class StateService implements OnDestroy {
    private stateSubscription = new Subscription();

    private stateSubject = new Subject<{ [key: string]: number }>();
    state$ = this.stateSubject
        .pipe(
            map(obj => Object.entries(obj).pop()),
            scan((state, [slice, value]: [string, number]): { [key: string]: number } => ({...state, [slice]: value}), {}),
            publishReplay(1)
        ) as ConnectableObservable<any>;


    constructor() {
        this.stateSubscription =  this.state$.connect();
    }

    ngOnDestroy(): void {
        this.stateSubscription.unsubscribe();
    }

    // setter with value not compose-able
    dispatch(v) {
        this.stateSubject.next(v);
    }

}
```
**Imperative Interaction Component**
```typescript
@Component({
    selector: 'component',
    template: `
        <p>Imperative Interaction</p>
        <pre>{{state$ | async | json}}</pre>
        <button (click)="updateCount()">
            Update State
        </button>
    `,

    providers: [StateService]
})
export class AnyComponent {
    state$ = this.stateService.state$;

    constructor(private stateService: StateService) {

    }

    updateCount() {
        this.stateService
            .dispatch(({count: ~~(Math.random() * 100)}));
    }

}
```

Why is this imperative? Imperative programming means working with instances and mutating state.
Whenever you write `setter` or `getter` you program in an imperative way because this is not compose-able.

If we now think about the `dispatch` method of `@ngrx/store` or our implemented `subscribe` and `next` calls,
we realize that it is similar to working with `setter` and `getter`.

But how can we go more declarative or even reactive? By providing something compose-able.
Like the observable itself.

**Declarative Interaction Service**
```typescript
export class StateService implements OnDestroy {
    private stateSubscription = new Subscription();

    private stateSubject = new Subject<Observable<{ [key: string]: number }>>();
    state$ = this.stateSubject
        .pipe(
            // process observables of state changes
            mergeAll(),
            // process single state change
            map(obj => Object.entries(obj).pop()),
            scan((state, [slice, value]: [string, number]): { [key: string]: number } => ({...state, [slice]: value}), {}),
            publishReplay(1)
        ) as ConnectableObservable<any>;


    constructor() {
        this.stateSubscription =  this.state$.connect();
    }

    ngOnDestroy(): void {
        this.stateSubscription.unsubscribe();
    }

    // "connector" with observable compose-able
    connectSlice(o) {
        this.stateSubject.next(o);
    }


}
```
**Declarative Interaction Component**
```typescript
@Component({
    selector: 'component',
    template: `
        <p>Declarative Interaction</p>
        <pre>{{state$ | async | json}}</pre>
        <button (click)="update$.next(true)">
            Update State
        </button>
    `,
    providers: [StateService]
})
export class AnyComponent {
    state$ = this.stateService.state$;
    update$ = new Subject();

    constructor(private stateService: StateService) {
        this.stateService.connectSlice(this.update$
            .pipe(map(_ => ({count: ~~(Math.random() * 100)}))));
    }
}
```

By providing the whole observable we can handle all related mechanisms
of subscription handling, as well as value processing and emission in the service.

With this we can now also handle our side-effects completely in the service:
**Service**
```typescript
export class DeclarativeSideEffectsGoodService implements OnDestroy {
    private effectSubscription = new Subscription();
    private effectSubject = new Subject<Observable<{ [key: string]: number }>>();

    constructor() {
        this.effectSubscription = (this.effectSubject
            .pipe(
                // process observables of side-effects
                // process side-effect
                mergeAll(),
                publishReplay(1)
            ) as ConnectableObservable<any>)
            .connect();
    }

    ngOnDestroy(): void {
        this.effectSubscription.unsubscribe();
    }

    connectEffect(o) {
        this.effectSubject.next(o);
    }

}
```
**Declarative Interaction Component**
```typescript
@Component({
    selector: 'declarative-side-effects-good',
    template: `
        <p>Declarative SideEffects</p>
    `,
    providers: [StateAndEffectService]
})
export class AnyComponent {
    constructor(private stateService: StateAndEffectService) {
        this.stateService.connectEffect(interval(1000)
            .pipe(tap(_ => ({count: ~~(Math.random() * 100)}))));
    }

}
```

Note the side-effect is now placed in a `tap` operator and the whole observable is handed over.

# Recap

So far we encountered following topics:
- _sharing a reference_ (not related to component state)
- subscription handling
- late subscriber
- cold composition
- moving primitive tasks as subscription handling and state composition into another layer
- declarative interaction between component and service

If we would pipe every incoming value to a "thing" and implement the a combination of the above problems
i a single place.

Let's see how the solutions look like when we put them into i.e. a service.

**LOW Level Component State Service**
```typescript
export class LowLevelStateService implements OnDestroy {
    private subscription = new Subscription();
    private effectSubject = new Subject<Observable<{ [key: string]: any }>>();
    private stateSubject = new Subject<Observable<{ [key: string]: any }>>();
    
    state$ = this.stateSubject
        .pipe(
            mergeAll(),
            map(obj => Object.entries(obj).pop()),
            scan((acc, [key, value]: [string, any]): { [key: string]: any } => ({...acc, [key]: value}), {}),
            publishReplay(1)
        ) as ConnectableObservable<any>;


    constructor() {
        this.subscription.add(this.state$.connect());
        this.subscription.add((this.effectSubject
            .pipe(mergeAll(), publishReplay(1)
            ) as ConnectableObservable<any>).connect()
        );
    }

    connectSlice(o) {
        this.stateSubject.next(o);
    }

    connectEffect(o) {
        this.effectSubject.next(o);
    }
    
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
```

**LOW Level Component State Service**
```typescript
import {Component, Input} from '@angular/core';
import {interval, Subject} from "rxjs";
import {map, tap} from "rxjs/operators";
import {LowLevelStateService} from "./low-level-component-state.service";

@Component({
    selector: 'low-level-state-component',
    template: `
        <p>Low-Level StateService</p>
        state$: <pre>{{state$ | async | json}}</pre>
        <button (click)="btn$.next($event)">
            Update Click Time
        </button>
    `,
    providers: [LowLevelStateService]
})
export class AnyComponent {
    sideEffect$ = interval(1000)
        .pipe(tap(_ => (console.log('Dispatch action to global store'))));

    state$ = this.stateService.state$;

    value$ = new Subject<number>();
    @Input()
    set value(value) {
        this.value$.next(value);
    }
    btn$ = new Subject<any>();

    constructor(private stateService: LowLevelStateService) {
        this.stateService
            .connectEffect(this.sideEffect$);
        this.stateService
            .connectSlice(this.value$.pipe(map(n => ({interval: n}))));
        this.stateService
            .connectSlice(this.btn$.pipe(map(e => ({time: e.timeStamp}))));
    }

}
```


# Dynamic Component State and Reactive Context
## Initialisation and Cleanup
## Overriding State Changes and Effects

