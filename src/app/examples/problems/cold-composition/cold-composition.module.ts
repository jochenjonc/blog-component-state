import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ColdCompositionContainerComponent} from "./cold-composition.container.component";
import {ColdCompositionBadComponent} from "./cold-composition-bad.component";
import {ColdCompositionComponent} from "./cold-composition.component";

const DECLARATIONS = [ColdCompositionContainerComponent, ColdCompositionBadComponent, ColdCompositionComponent];
export const ROUTES = [{
  path: '',
  component: ColdCompositionContainerComponent
}];
@NgModule({
  declarations: [ DECLARATIONS ],
  imports: [
    CommonModule
  ],
  exports: [ DECLARATIONS ]
})
export class ColdCompositionModule { }
