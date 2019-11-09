import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {SharingAReferenceBadDisplayComponent} from "./sharing-a-reference-bad.display.component";
import {SharingAReferenceGoodDisplayComponent} from "./sharing-a-reference-good.display.component";
import {SharingAReferenceContainerComponent} from "./sharing-a-reference.container.component";
import {SharingAReferenceImpDisplayComponent} from "./sharing-a-reference-imp.display.component";

export const ROUTES = [
    {
        path: '',
        component: SharingAReferenceContainerComponent
    }
];
const DECLARATIONS = [SharingAReferenceContainerComponent, SharingAReferenceBadDisplayComponent, SharingAReferenceGoodDisplayComponent, SharingAReferenceImpDisplayComponent];

@NgModule({
    declarations: [DECLARATIONS],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [DECLARATIONS]
})
export class SharingAReferenceModule {

}
