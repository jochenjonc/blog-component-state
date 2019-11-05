import {Pipe, PipeTransform} from "@angular/core";
import {select} from "@ngrx/store";

@Pipe({
    name: 'select',
})
export class SelectPipe implements PipeTransform {
    transform(state: any, selector ): any {
        return selector(state);
    }

}
