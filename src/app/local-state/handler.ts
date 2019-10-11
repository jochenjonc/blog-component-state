import { observable, Observable, ObservableInput, OperatorFunction, Subject } from "rxjs";


/**
 * 
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */


export const handler = <T, R>(
  operator?: OperatorFunction<T, R>
): ((value: T) => void) & ObservableInput<T | R> => {
  const subject = new Subject<T>();
  const source = operator ? subject.pipe(operator) : subject;

  const next: any = (arg: T) => subject.next(arg);
  next[observable] = () => source;
  const error: any = (arg: T) => subject.error(arg);
  error[observable] = () => source;
  const complete: any = () => subject.complete();
  next[observable] = () => source;

  return next;
}



// =========================
// https://github.com/zodiac-team/zodiac-ui/blob/2b1197bf556188c2bc10fb886aa575bc2648ef80/libs/ng-observable/lib/internals/callable.ts

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(
                derivedCtor.prototype,
                name,
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || {},
            )
        })
    })
}

export const mixins: unique symbol = Symbol()

export class Callable<T extends Function> extends Function {
    constructor(fn: T) {
        super()
        return Object.setPrototypeOf(fn, new.target.prototype)
    }
}


export type NextFn<T> = (next: T) => void

export interface InvokeSubject<T> extends Subject<T> {
    (next: T): void
    (...next: T extends Array<infer U> ? T : never[]): void
}

/**
 * A subject that implements both `Subject<T>` and `Function` interfaces. Using this subject in place of a normal
 * method turns all invocations of that method into an observable stream without needing to modify the source of
 * the caller. When called with multiple arguments it will emit the arguments as an array.
 *
 * @usageNotes
 *
 * Basic usage
 *
 * ```ts
 * const subject = new InvokeSubject<string>() // single argument
 * const subject2 = new InvokeSubject<[string, number]>() // multiple arguments
 *
 * subject("message")
 * subject2("message", 42)
 *
 * // with custom invoke function
 * const subject3 = new InvokeSubject<string>(function () {
 *     subject3.next("message") // call "next" to emit value
 * })
 * ```
 *
 * Convert `@HostListener` and `(event)` bindings into observable streams
 *
 * ```ts
 * @Component({
 *     template: `<input type="text" (input)="inputChanges($event)" />`
 * })
 * export class MyComponent implements OnDestroy {
 *     @HostListener("click", ["$event"])
 *     readonly hostClick = new InvokeSubject<MouseEvent>()
 *     readonly inputChanges = new InvokeSubject<Event>()
 *
 *     constructor() {
 *         hostClick.subscribe(event => console.log(event))
 *         inputChanges.subscribe(event => console.log(event))
 *     }
 * }
 * ```
 *
 * @publicApi
 */
export class InvokeSubject<T> extends Callable<NextFn<T>> {
    private static [mixins] = applyMixins(InvokeSubject, [Observable, Subject])

    /**
     * Creates a new `InvokeSubject` instance
     *
     * @param nextFn A function to be called when the subject is invoked
     *
     */
    constructor(nextFn?: NextFn<T>) {
        super(nextFn ? nextFn : (...args: any) => {
            const len = args.length
            if (len === 0) {
                this.next()
            } else if (len === 1) {
                this.next(args[0])
            } else {
                this.next(args)
            }
        })
        Object.assign(this, new Subject())
    }
}
