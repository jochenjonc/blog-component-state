import {ChangeDetectionStrategy, Pipe, PipeTransform, OnDestroy} from '@angular/core';
import { TimingGlobalService } from './timing.global.service';

@Pipe({
  name: 'childPipe'
})
export class TimingChildPipe implements PipeTransform, OnDestroy {

  constructor(private globalService: TimingGlobalService) {
    console.log('ChildPipe Constructor');
  }

  transform(value, args): any {
    console.log('ChildPipe transform', value); 
    return value;
  }

  ngOnDestroy() {
    console.log('ChildPipe OnDestroy');
  }

}
