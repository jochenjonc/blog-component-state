# Tackling Componen-State Reactively

<!-- toc -->

  * [Historical problems with state management in the frontend](#historical-problems-with-state-management-in-the-frontend)
- [Layers of state](#layers-of-state)
- [What is the ephemeral state?](#what-is-the-ephemeral-state)
  * [Global vs Local Accessibility of Data Structures](#global-vs-local-accessibility-of-data-structures)
  * [Static vs Dynamic Lifetime of Data Structures](#static-vs-dynamic-lifetime-of-data-structures)
  * [Global vs Local Processed Sources](#global-vs-local-processed-sources)
  * [Recap](#recap)
- [Fundamental Architectural Decisions](#fundamental-architectural-decisions)
  * [Problems to Solve on a Low Level](#problems-to-solve-on-a-low-level)
    + [Timing](#timing)
    + [Subscription Handling](#subscription-handling)
    + [The Late Subscriber Problem](#the-late-subscriber-problem)
    + [Sharing Work and References](#sharing-work-and-references)
  * [The Cold Composition Problem](#the-cold-composition-problem)
  * [Subscription-Less Interaction with Component StateManagement](#subscription-less-interaction-with-component-statemanagement)
    + [Subscription-Less Handling of Side-Effects](#subscription-less-handling-of-side-effects)
  * [Recap](#recap-1)
- [Basic Usage](#basic-usage)
  * [Service Design](#service-design)
  * [Service Implementation](#service-implementation)
  * [Service Usage](#service-usage)
- [Glossar](#glossar)
- [Rethinking Components based on Ephemeral State Management](#rethinking-components-based-on-ephemeral-state-management)
- [Dynamic Component State and Reactive Context](#dynamic-component-state-and-reactive-context)
  * [Initialisation and Cleanup](#initialisation-and-cleanup)
  * [Overriding State Changes and Effects](#overriding-state-changes-and-effects)

<!-- tocstop -->

## Historical problems with state management in the frontend

When I started with the topic of state management I encountered 2 main problems I had
which I also see in the majority of our community.

1. We have a lack in education. We don't know enough of the fundamentals in IT. 
2. We often tend to blindly copy stuff.

Many of us did not know about global state management a year ago,
even if these problems an many different solution were out there for a long tim e already.

What happened not that long a go is people took over a concept from the react world called REDUX.
They thought it is a pattern, It got advertised, articles got written and now we have the situation where 
"the REDUX pattern" is a term. 
In fact there is no REDUX pattern and also react or elm did not invented that.

It's simple [CQRS](), a @TODO old software design design pattern. :D
In my talk [Advanced Patterns in RxJS - Operating heavily dynamic UI'S]() I gave some basic information on that.

As I did so often in my career, and others too, I blindly copied stuff over without questioning it.
This is the reason why nowadays libraries often are a blind reimplementation of other wrong or inconsistent implementations.

To give you some idea. In angular nearly all state management libs miss a layer for meta information.
This leads to situations where people tend to put stuff in global state which clearly does not belong there.
The status of some remote sources vs the state retrieved from them. 
The data we fetch i.e. a list of items, is the **state on the server** that we want to use in the frontend vs 
**the status of a resource**, i.e. if a connection is established, if it is currently loading/loaded
or their meta information to responses as success and error information.

So our fundamental problem we have at the moment is,
we lack a clear understanding of the different layers of state 
as well as their proper handling.


# Layers of state

In this article I will introduce 3 layers of state:
- Persistent Server State
- Resource Status Information (Meta-Level State)
- Persistent Client State (Global State)
- Ephemeral Client State (Local State)

![](https://github.com/BioPhoton/blog-component-state/raw/master/images/reactive-local-state_layers-of-state__michael-hladky.png "Layers of State")

**Persistent Server State** is the data in your database. It is provided to the consumer over a data API like REST, GraphQL, Websocket, etc.
**Meta-Level State** is information related to the status of a resource that provides us state. I.E. Loading, Error, Success etc.
For persistent and ephemeral client states I will try to use to more simpler wording **Global State** and **Local State**, where ephemeral state maps to the local state.
Both live on the client but they demand different handling.

In this article I want to focus on ephemeral state. 

# What is the ephemeral state?

![](https://github.com/BioPhoton/blog-component-state/raw/master/images/reactive-local-state_ephemeral-state__michael-hladky.png "What is Ephemeral State")

The ephemeral state is just one of many names for data structures 
that needed to be managed on the client under special conditions.
Other synonyms are UI state, local state, component state, etc...

It is the data structure that expresses the essential state 
of an isolated unit like for example a component in your application.

As isolated is a bit vague let me get a little bit more concrete.

## Global vs Local Accessibility of Data Structures

The global state is well known in modern web development. 
It is the state we share globally in our app i.e. a `@ngRx/store` or the good old `window` object ;)

This is not called an ephemeral state, but the persistent state.

![](https://github.com/BioPhoton/blog-component-state/raw/master/images/reactive-local-state_global-accessible__michael-hladky.png "Global Accessible State")

As we can see one global source distributes state to the whole app.
 
If we compare this to a local state we see that this data structure is provided and managed only in a certain scope of your app.

![](https://github.com/BioPhoton/blog-component-state/raw/master/images/reactive-local-state_local-accessible__michael-hladky.png "Local Accessible State")

This is our first rue of thumb to detect local state: 

> No horizontal sharing of the state i.e. with sibling components.

## Static vs Dynamic Lifetime of Data Structures

In Angular global state is nearly always shared over global singleton services.
Their lifetime starts even before the root component. And ends after every child component.
Its lifetime is ~equal to the Apps lifetime or the browser windows lifetime.

This is static called a static lifetime.
![](https://github.com/BioPhoton/blog-component-state/raw/master/images/reactive-local-state_lifetime-global-singleton-service__michael-hladky.png "Lifetime Global Singleton Service")


If we compare this to the lifetime of other building blocks of angular we can see their lifetime is way more dynamic.
![](https://github.com/BioPhoton/blog-component-state/raw/master/images/reactive-local-state_lifetime-angular-building-blocks__michael-hladky.png "Lifetime Angular Building Blocks")

The best example of a dynamic lifetime is data that gets rendered over the `async` pipe.

![](https://github.com/BioPhoton/blog-component-state/raw/master/images/reactive-local-state_lifetime-async-pipe__michael-hladky.png "Lifetime async Pipe")

The lifetime depends on the evaluation of the template expression, a potential `*ngIf` that wraps the expression or many other things.

Our second rule of thumb we detected for the local state is: 

> The lifetime is dynamic i.e. bound to an async pipe

## Global vs Local Processed Sources

Where our global state service nearly always processes remote sources:
- REST API's
- Web Sockets
- Browser URL
- Browser Plugins
- Global Static Data

And te logic is located in the upper layer of our architecture. 

![](https://github.com/BioPhoton/blog-component-state/raw/master/images/reactive-local-changes_processing-global-sources__michael-hladky.png "Processing of Global Sources")


A local state service would nearly always focus on the process the following: 
- Data from @InputBindings
- UI Events
- Component level Side-Effects
- Parsing global state to local

![](https://github.com/BioPhoton/blog-component-state/raw/master/images/reactive-local-changes_processing-local-sources__michael-hladky.png "Processing of Local Sources")


The third rule of thumb we say: 

> It processes local relevant events i.e. sort/filter change


---

## Recap

> **We defined 3 rules of thumb to detect ephemeral/local state**
> - No horizontal sharing of state
> - The lifetime of the state is dynamic
> - It processes local relevant events

Some real-life example that matches the above-defined rules are:
- sorting state of a list
- form errors
- state of an admin panel (filter, open/close, ...)
- any dynamic appearing data
- accumulations from @Input data
 
You rarely share this data with sibling components, it only shares data-structures only locally and focuses mostly on local sources.
In other words, there is no need to use state management libraries like ngrx, ngxs, Akita, etc. there.

Still, we need a way to manage these data structures.


# Fundamental Architectural Decisions

As a first and foundational decision in the way of data distribution, we will pick a push-based architecture.
This has several advantages but more important defines the problems we will run into when implementing a solution.
As we defined the way how we want to distribute our data let me list a set of problems we need to solve.

## Problems to Solve on a Low Level

If you go back in history you will find almost all our nowadays "cutting edge problems" already solved. 
When I realized the first time that life is a constant evolutionary repetition I started to change my strategy on solving problems.

Before I almost always started to implement a half backed cool idea which I was certain is most up to date.

After I made many mistakes and got some incredibly helpful insights I changed my way of solving problems completely.

Let me quote **The Gang Of Four** to give you a first glimpse of my fundamental changes in how I approach problems:

So here is what the gang of four says about Object-Oriented-Software-Design-Patterns: 

> If you use the fundamental building blocks of object oriented programming correctly,
> the design patterns appear naturally from your code.

With that in mind I did not work on a solution for local state management,
but tried to look at all the different problems that we will face when managing any local state in general and also some specific problems related to Angular.

### Timing

As a lot of problems I ran into in applications are related to timing issues, 
this section is here to give a quick overview of all the different types of issues and their reason.

Shouldn't FRP be by design timing independent?

I mean not that there is no time in observables, but when we compose observables we should not care about when any of our state sources exactly emit a value... 

That's the case, in a perfect reactive setup, we don't need to care about those problems.
However, as Angular is an object-orientated framework we have to often with different problems related to life-cycles of components and services, router-events and many more things.

In RxJS timing is given by the following:
- For hot observables the **time of creation**
- For cold observables the **time of subscription**
- For emitted values the **scheduling process**

In Angular timing is given by the following:
- For global services the **creation** as well as the application **lifetime**
- For components the **creation**, several **life-cycle hooks** as well as the component **lifetime**
- For local services the **creation** of the component as well as the components **lifetime**
- For pipes or directives in the template also the components **lifetime**

All timing relates things in Angular are in an object-oriented style, very similar to hot observables.
Subscription handling can be done declaratively over completion operators. 
The scheduling process can be controlled both over imperative or over operators and can influence the execution context of the next error or complete callback.

We see that there are two different concepts combined that have completely different ways of dealing with timing. 
Angular already solved parts of this friction points but some of 
they are still left and we have to find the right spots to put our glue code and fix the problem.

![](https://github.com/BioPhoton/blog-component-state/raw/master/images/angular-timeline__michael-hladky.png "Angular Timeline")

This chart shows a minimal Angular app with the different building units ant their timing:  
In this example it marks:
- the global store lifetime
- the component store lifetime
- the async pipe lifetime

As we can see It makes a big difference where we place observables and where we subscribe to them. 
It also shows where we need hot observables and where we need to replay values.

### Subscription Handling

Let's discuss where subscriptions should take place and for which reason they are made.

Subscriptions are here to receive values from any source.

In most cases, we want to render incoming values.
For this reason, we use a `Pipe` or a `Directive` in the template to trigger
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
But this code could get moved somewhere else. We could use
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

In this way, we get rid of thinking about subscriptions in the component at all.

### The Late Subscriber Problem

![](https://github.com/BioPhoton/blog-component-state/raw/master/images/late-subscriber__michael-hladky.png "Late Subscriber")

Incoming values arrive before the subscription has happened.

For example state over `@Input()` decorators arrive before the view gets rendered and a used pipe could receive the value.

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

We call this situation a late subscriber problem. In this case, the view is a late subscribe to the values from '@Input()' properties.
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

### Sharing Work and References

In this section we will face the first time a problem that might need some more thinking.

To start this section let's discuss the components implementation details first.
We focus on the component's outputs. 

```typescript
@Component({
    ...
})
export class AnyComponent {
    @Output() compOutput = new EventEmitter()
}
```

Let's take a closer look at the EventEmitter interface:
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
An observable for example provides a `subscribe` method. 
Therefor we can directly use it as value stream for our `@Output` binding.

Knowing that enables us to take some very nice and elegant shortcuts as well as reducing the amount of code we need to write.

With this in mind let's focus on the original problem, sharing a work and references.

In this example, we receive a config object from the parent component
turn it into a reactive form and 
emit changes from the form group created out of the config object.

Every time we receive a new value from the input binding 
- we create a config object out of it
- and use the `FormBuilder` service to create the new form.
As output value, we have to provide something that holds a `subscribe` method.
So we could use the form groups `valueChanges` to provide the forms changes directly as component output events.

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

If we run the code we will see that the values are not updating in the parent component.

We faced a problem related to the fact that nearly all observables are cold, which means that every subscriber will get it's own instance of the producer.

You might be even more confused now, as our source that produces the formGroup is a `ReplaySubject`.
Which is multi-casting values and sharing one producer with multiple subscribers...

What we forgot here is that our `formGroup$` observable ends with a `map` operator,
which turns everything after it again into a uni-cast observable.

So what happened? 
We subscribed once in the template over the `async` pipe to render the form.
And another time in the component internals to emit value changes from the form.

As we now know that the map operator turned everything into a uni-cast observable again,
we realize created a new `FormGroup` instance for every subscription.
The subscription in the template as well as the subscription happens internally over @Output().

This can be solved by adding a multicast operator like `share` or `shareReplay` at the end of `formGroup$`.

As we also have late subscribers, the `async` pipe in the template, we use `shareReplay` with `bufferSize` 1 serve them the actual formGroup instance. 

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
This does not solve the problem of cold composition but is fine to share specific work or in this case a reference.

Later on in this article we will remember this problem to provide a way to share work an instances.

## The Cold Composition Problem

Let's quickly clarify hot/cold and uni-case/multi-cast.

**cold** 
This means the producer sits inside of the observable.
Whenever `subscribe` is called the subscriber function fires and we create a new instance fo the producer.
i.e. the static `interval` gets created whenever we subscribe to it. 
Internally `setInterval` and `clearInterval` is call for every `subscribe` and `unsubscribe`.

**hot**
This means the producer sits outside of the observable. The producer emits values independent of the subscriber. 

If `subscribe` is called we will receive all values from the moment of subscription on, but past values are not recognized.
i.e. the `@Input` binding is a hot producer that sits outside of our `Subject` and emits values independent of the moment when `async` pipe subscribes.

**uni-cast**
This means the producer is unique per subscription.
i.e. `from event` is a uni-cast observable as we pass a
new function per subscription for the internal `.addEventListener` call.
And if we unsubscribe we remove only this function, and not the others.

**multi-cast**
This means there is one producer instance fol all subscriptions.
i.e. A subject that emits the values from a single producer to all subscribers.

With this in mind, we can discuss the problem of cold composition in the case of our **component state**.

--- 

As we will have to deal with:
- View Interaction ( button click )
- Global State Changes ( HTTP update )
- Component State Changes ( triggered by button or interval )

Putting all this logic in the component class is a bad idea. 
Not only because of the separations of concerns but also because we would have to implement it over and over again.

We need to create the logic that deals with problems around the composition
in a way that it can be reused!

So far our sources got subscribed to when the view was ready and we rendered the state.
As the view represents a hot producer of values and injected services too we have to decouple the service that handles component state from other sources.

**So what is the problem?!?! 11**

We have hot sources and we have to compose them. As we already learned in the section _sharing work and instances_ nearly every operator returns a cols source again. 
No matter if it was hot before.

Furthermore we can assume a minimal requirement to the created state is we should have at least the last emission of each source to compute a state.

If we compose state we have to consider that every operator returns cold observables.
(Operators that return `ConnectableObservable` are not operators as they are not compos-able)

So no matter what we do before, after an operation we get a cold observable, and we have to subscribe to it to trigger the composition.
I call this situation cold composition, as with selector functions in i.e. publish we are also able to create hot compositions.

Some of our sources are This can be solved by tow ways: 
- a) Make all sources replay at least their last value (push workload to all relevant sources)
- b) Make the composition hot as early as possible (push workload to the component related part)

Let's discuss a) first.

If we would make every source replay at least the last value we would have to implement this logic in the following places:
- View Input bindings (multiple times)
- View events (multiple times)
- Other Service Changes (multiple times)
- Component Internal interval (multiple times)

It would also force the parts to cache values and increase memory.
Furthermore, it would force the third party to implement this too. 

IMHO not scalable.

What would be the scenario with b)?

We could think of the earliest possible moment to make the composition hot. 
From the diagram above we know that service, even if locally provided, 
is instantiated first, before the component.

If we would put it there we could take over the workload from:
- View Input bindings (multiple times)
- View events (multiple times)
- Component Internal interval (multiple times)

All involved services can not be covered. 

But what services are we interested in?

Stateful services and stateful services will, by definition, always provide there last emitted state.
So if we compose other sources form services like `@ngRx/store` etc. we can assume they replay their last emitted state and we can run the composition.

In the worse case, we could fix it by contacting with an initial value. 

Let's see a simple example where we compose different sources in service and one of our sources is not replaying the last value:

**Service:**
```typescript
export class SomeBadService implements OnDestroy {
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

    constructor(public someService: SomeService) {
         // earliest possible moment to subscribe to a service
         this.someService.composedState$.subscribe(s => console.log('composedState bad: ', s) );
    }

    ngOnDestroy(): void {
        this.input$.complete()
    }
}
```

If we run the code we would start rendering with {sum: 1}.

The service is the first thing that gets initialized.
The initial commands are fired, but the initial values are fired before the component gets instantiated
and subscribes to the service. 

Even if the source is hot (the subject in the service is defined on instantiation) the composition made the stream cold again.
This means the composed values can be received only if there is at least 1 subscriber. 
In our case, the subscriber was the component constructor. 

Let's see how we can implement the above discussed solution with hot composition:

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
source replay the last emitted value by using `1` as `bufferSize`.

In the service constructor, we called `connect` to make it hot subscribe to the source.

## Subscription-Less Interaction with Component StateManagement

So far we only had focused on independent peace and didn't pay much attention to their interaction.
Let's analyze the way we interact with components and services so far.

Well, known implementations of sate management like `@ngrx/store`,
which is a global state management library, implemented the consumer-facing API imperatively.
The provided method is `dispatch` which accepts a single value that gets sent to the store. 

Let's look at a simple example:

**Imperative Interaction Service**
```typescript
export class StateService implements OnDestroy {
    private stateSubscription = new Subscription();

    private stateSubject = new Subject<{ [key: string]: any }>();
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
        <button (click)="update$.next(true)">
            Update State
        </button>
    `,

    providers: [StateService]
})
export class AnyComponent implements OnDestroy {
    subscription = new Subscription();
    update$ = new Subject();
    state$ = this.stateService.state$;

    constructor(private stateService: StateService) {
        this.subscription = this.update$
            .subscribe(() => {
                 this.stateService
                    .dispatch(({count: randomNumber()}));
            });
    }
    
    ngOnDestroy() {
        this.subscription
            .unsubscribe();    
    }

}
```

Why is this imperative? Imperative programming means working with instances and mutating state.
Whenever you write `setter` or `getter` you program in an imperative way because this is not compose-able.

If we now think about the `dispatch` method of `@ngrx/store` or our implemented `subscribe` and `next` calls,
we realize that it is similar to working with `setter` and `getter`.

But how can we go more declarative or even reactive? 
**By providing something compose-able**

Like an observable itself. :)

By adding a single line of code we can go **fully declarative as** well as  **fully subscription-less**.

**Declarative Interaction Service**
```typescript
const stateAccumulator = (acc, [key, value]: [string, number]): { [key: string]: number } => ({...acc, [key]: value});

export class StateService implements OnDestroy {
    private stateSubscription = new Subscription();
    private stateAccumulator = stateAccumulator;
    private stateSubject = new Subject<Observable<{ [key: string]: any }>>();
    state$ = this.stateSubject
        .pipe(
            // process observables of state changes
            mergeAll(),
            // process single state change
            map(obj => Object.entries(obj).pop()),
            scan(this.stateAccumulator, {}),
            publishReplay(1)
        ) as ConnectableObservable<any>;


    constructor() {
        this.stateSubscription =  this.state$.connect();
    }

    ngOnDestroy(): void {
        this.stateSubscription.unsubscribe();
    }

    // "connector" with observable (compose-able)
    connect(o) {
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
        this.stateService.connect(this.update$
            .pipe(map(_ => ({count: randomNumber()}))));
    }
}
```

Let's take a detailed look at the introduced changes:

1. In `StateService` we changed 
`stateSubject = new Subject<{ [key: string]: any }>();`
to 
`stateSubject = new Subject<Observable<{ [key: string]: any }>>();`
2. In `StateService` we added the `mergeAll()` operator to ors state processing
3. In `StateService` we replaced the `dispatch` method 
```
dispatch(v) {
    this.stateSubject.next(v);
}
```
that took a single value to `connect`
```
connect(o) {
    this.stateSubject.next(o);
}
```

By providing the whole observable we can handle all related mechanisms
of subscription handling, as well as value processing and emission in the service.


As a last additional benefit in this section we can talk a little bit about side-effects:

### Subscription-Less Handling of Side-Effects

If we recap the above snippet we can see that we not only introduced a subscription-less way for state management interaction, 
but also a very elegant way to handle side-effects over our service:

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
            .pipe(tap(_ => ({count: randomNumber()}))));
    }

}
```

Note the side-effect is now placed in a `tap` operator and the whole observable is handed over.

## Recap

So far we encountered the following topics:
- sharing work and references
- subscription handling
- late subscriber
- cold composition
- moving primitive tasks as subscription handling and state composition into another layer
- declarative interaction between component and service

If you may already realize all the above problems naturally collapse into a single piece of code.
:)

Also if you remember from the beginning this is what "the gang of four" quote says about Object Oriented Design Patterns.
:)

We can be happy as we did a great job so far. We focused on understanding the problems,
we used the language specific possibilities the right way,
and naturally we ended up with a solution that is compact, robust and solves all related problems in a elegant way.

Let's see how the local state service looks like:

# Basic Usage

## Service Design

**Local State Service**
```typescript
export class LocalState implements OnDestroy {
    private _subscription = new Subscription();
    private _effectSubject = new Subject<Observable<any>>();
    private _stateSubject = new Subject<{ [key: string]: any }>();
    private _stateSubjectObservable = new Subject<Observable<{ [key: string]: any }>>();
    
    private _state$ = merge(
                        this._stateSubject,
                        this._stateSubjectObservable.pipe(mergeAll()),
                     )
        .pipe(
            map(obj => Object.entries(obj).pop()),
            scan((state, command) => ({...state, ...command}), {}),
            publishReplay(1)
        );


    constructor() {
        this._subscription.add(this.state$.connect());
        this._subscription.add(this.effectSubject
            .pipe(mergeAll(), publishReplay(1)).connect()
        );
    }
  
    select(operatos) {
        return this._state$
            .pipe(
                operatos,
                shareReplay(1)
            );
    }
 
    setState(s) {
        this._stateSubject.next(o);
    }
    connectState(o) {
        this._stateSubject.next(o);
    }

    connectEffect(o) {
        this._effectSubject.next(o);
    }
    
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

}
```

## Service Implementation

Now lets see some minimal examples on how to use the service:

**Extending the service**
```typescript
@Component({
    selector: 'component',
    template: `
        <p>Component</p>
        ...
    `
})
export class AnyComponent extends LocalState {

    constructor() {
        this.super();
    }

}
```

**Injecting the service**
```typescript
@Component({
    selector: 'component',
    template: `
        <p>Component</p>
        ...
    `,
    providers: [LocalState]
})
export class AnyComponent {

    constructor(private stateService: LocalState) {
    }

}
```

## Service Usage

**Connecting Input-Bindings**
```typescript
@Component({
    selector: 'component',
    template: `
        <p>Component</p>
        ...
    `
})
export class AnyComponent extends LocalState {

    @Input() 
    set value(value) {
        this.setState({slice: value})
    }

    constructor() {
        this.super();
    }

}
```

**Connecting GlobalState**
```typescript
@Component({
    selector: 'component',
    template: `
        <p>Component</p>
        ...
    `
})
export class AnyComponent extends LocalState {

    @Input() 
    set value(value) {
        this.setState({slice: value})
    }

    constructor(private store: Store) {
        this.connectState(
            this.store.select(getStateSlice)
                    .pipe(transformation)
        );
    }

}
```

**Selecting LocalState**
```typescript
@Component({
    selector: 'component',
    template: `
        <p>Component</p>
        <button (click)="click$.next()">btn</button>
        {{state$ | async}}
    `
})
export class AnyComponent extends LocalState {
    click$ = new Subject(); 
    
    state$ = this.select(
        withLatestFrom(click$),
        map(([state, _]) => state.slice)
    );    
   
}
```

**Handling LocalSideEffects**

```typescript
@Component({
    selector: 'component',
    template: `
        <p>Component</p>
        ...
    `
})
export class AnyComponent extends LocalState {
    
    constructor(private store: Store) {
        this.connectEffect(interval(10000)
            .pipe(tap(this.store.dispatch(loadDataAction)))
        );
    }

}
```

# Glossar

- Global State 
- Local State
- CQRS


---

# Rethinking Components based on Ephemeral State Management 


# Dynamic Component State and Reactive Context
With a more declarative interaction between components and service, we made a big change.
We are now aware of the whole observable context. 

The `next`, `error` and `compolete` notifications.

This can help us to rethink a lot of problems that did not occur with global state management.

## Initialisation and Cleanup

Initializing the state worked well in global state management by providing a default value in the reducer function. 
Also with input bindings, we could set a default value. But there are situations where we need to initialize a not yet emitted state.
In addition to that with a highly dynamic state like we have with the components state, we also have to think about the clean up unused state.

With the declarative approach, we have now the ability to react to the completion of an observable.

The current accumulation function for the components state looks like this:

```typescript
const stateAccumulator = (state, [key, value]: [string, number]): { [key: string]: number } => ({...state, [key]: value});
```

Let's add minimal logic to our state accumulation part and discuss it.

```typescript
const stateAccumulator = (state, [keyToDelete, value]: [string, number]): { [key: string]: number } => { 
    const isKeyToDeletePresent = keyToDelete in state;
    // The key you want to delete is not stored :)
    if (!isKeyToDeletePresent && value === undefined) {
        return state;
    }
    // Delete slice
    if (value === undefined) {
        const {[keyToDelete]: v, ...newS} = state as any;
        return newS;
    }
    // update state
    return ({...state, [keyToDelete]:value});
};
```

Now, let's think about the following example:

```typescript
@Component({
    selector: 'state-init-and-cleanup-bad',
    template: `
    <button (click)="addDynamicState()">Add dynamic state</button>
    <p><b>state$:</b></p>
    <pre>{{state$ | async | json}}</pre>
  `,
    providers: [ComponentStateService]
})
export class StateInitAndCleanupComponent {
    state$ = this.componentState.state$;

    constructor(private componentState: ComponentStateService) {
    }

    addDynamicState() {
        this.componentState.connectState(this.getDynamicStateSlice())
    }

    getDynamicStateSlice(): Observable<{ [key: string]: number | undefined }> {
        const rnd = (p = 1): number => ~~(Math.random() * (10 ** p));
        const takeCount = rnd(1);
        const intervalDuration = rnd(3);
        const id = `rnd ${rnd(2)}-${intervalDuration}-${takeCount}`;
        const interval$ = interval(intervalDuration).pipe(map(_ => ({[id]: rnd()})), take(takeCount));

        return interval$;
    }

}
```

Whenever we click the button we add a state slice from an observable. The observable has a random number of emissions in a random interval.
If the interval ends the key still stuck's in the state object.

As the keys where dynamic there is not really a good way of detection which key is not changing anymore and can be removed.

Let's see what we can do with the above example.
As we know we adopted the accumulation function to remove keys with undefined from the state object.

By emitting `undefined` after emission of the last value, we can clean up this state.
We can also initialize it with zero even if the first value is sent later.

Lets add one line to our state slice observable:

```typescript
getDynamicStateSlice(): Observable<{ [key: string]: number | undefined }> {
        ... 
        const interval$ = interval(intervalDuration).pipe(map(_ => ({[id]: rnd()})), take(takeCount));
        const observables = [of({[id]: 0}), interval$, of({[id]: undefined})];
        return concat(...observables);
    }
```

Now we have an immediate initial value if the state changes are started and cleanup-logic if the state observable is no longer needed.

Thinks about many dynamic parts of your view that you display and hide or some that you rarely show in the UI.
All those dynamism is automatically solved if the source stream completes.

The solution for dynamic Observables from the view belongs not to this document.

## Overriding State Changes and Effects

As we are now able to provide observables that contain our state changes a new question needs to get asked.

What happens if we provide multiple observables for the same state slice?

Two possible things can happen:
- Both observable get merged and all emissions change the same state slice concurrent
- The new observable for the same state slice overrides the changes from the previous observable for this state slice

Let's discuss scenarios for both.

**Concurrent State Changes**


**Override State Changes**



