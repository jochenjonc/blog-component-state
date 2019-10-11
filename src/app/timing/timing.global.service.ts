import {Injectable, OnDestroy} from '@angular/core';

@Injectable({providedIn: 'root'})
export class TimingGlobalService {
  
  constructor() {
    console.log('GlobalService Constructor');
  }

  ngOnDestroy() {
    console.log('GlobalService OnDestroy');
  }
}