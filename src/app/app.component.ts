import { Component } from '@angular/core';
import {Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'my-app',
  template: `
  <ul>
    <li>
     <a [routerLink]="['timing']">timing</a>
    </li>
     <li>
     <a [routerLink]="['late-subscriber']">Late Subscriber</a>
    </li>
    <li>
     <a [routerLink]="['local-state']">Local State</a>
    </li>
  </ul>
  <router-outlet></router-outlet>
  `
})
export class AppComponent  {

  constructor(http: HttpClient){
    http.get('https://api.github.com/users/BioPhoton').subscribe(console.log)
    console.log('AppComponent Constructor'); 
  }

}
