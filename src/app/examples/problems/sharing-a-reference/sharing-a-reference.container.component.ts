import {Component} from '@angular/core';
import {interval, of, Subject} from 'rxjs';
import {share} from "rxjs/operators";

@Component({
    selector: 'sharing-a-reference-container',
    template: `
   
    `
})
export class SharingAReferenceContainerComponent {

   constructor() {
       const sub = new Subject();

       const int = interval(500).pipe(share());

     //  int.subscribe(v => console.log('sub1', v) )

       setTimeout(() => {
           int.subscribe(v => console.log('sub2', v) )
       }, 6000);


   }
}
