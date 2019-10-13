import {pipe} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';

export function selectSlice<T>(operators: (s: any) => any) {
    return pipe(
        operators ? operators : o => o,
        // @TODO what if we select a state that is not given?
        distinctUntilChanged<T>()
    );
}

export function isArray(obj) {
    return (Object.prototype.toString.call(obj) === "[object Array]");
}
