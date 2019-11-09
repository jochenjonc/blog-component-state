import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable, ReplaySubject, Subscription} from 'rxjs';
import {map, startWith, switchMap} from 'rxjs/operators';

@Component({
    selector: 'sharing-a-reference-imp-display',
    template: `
        <h2>Sharing a reference Imperative</h2>
        <form *ngIf="formGroup" [formGroup]="formGroup">
            <div *ngFor="let c of formGroup.controls | keyvalue">
                <label>{{c.key}}</label>
                <input [formControlName]="c.key"/>
            </div>
        </form>
    `
})
export class SharingAReferenceImpDisplayComponent {
    subscription = new Subscription();
    formGroup: FormGroup;

    @Input()
    set formGroupModel(modelFromInput: {[key: string]: any}) {
        if(modelFromInput) {
            this.updateFormAndOutput(modelFromInput);
        }
    }

    @Output() formValueChange = new EventEmitter();

    constructor(private fb: FormBuilder) {
        this.updateFormAndOutput({});
    }

    updateFormAndOutput(formConfig) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.formGroup = this.getFormGroupFromConfig(formConfig);
        this.subscription = this.formGroup.valueChanges
            .subscribe(v => this.formValueChange.next(v));
    }

    getFormGroupFromConfig(modelFromInput: {[key: string]: any}): FormGroup {
        const config = Object.entries(modelFromInput)
            .reduce((c, [name, initialValue]) => ({...c, [name]: [initialValue]}), {});
        return this.fb.group(config);
    }



}
