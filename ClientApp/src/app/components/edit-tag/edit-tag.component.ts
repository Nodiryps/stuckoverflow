import { Component, OnInit, ɵɵcontainerRefreshEnd } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { TagService } from '../../services/tag.service';
import {
    FormBuilder, FormGroup, Validators, FormControl,
    AsyncValidatorFn, ValidationErrors
} from '@angular/forms';
import * as _ from 'lodash';
import { Tag } from 'src/app/models/tag';

@Component({
    selector: 'app-edit-tag-mat',
    templateUrl: './edit-tag.component.html',
    styleUrls: ['./edit-tag.component.css']
})

export class EditTagComponent {
    public frm: FormGroup;
    public ctlId: FormControl;
    public ctlName: FormControl;

    public isNew: boolean;

    private minLengthPseudoPasswordName: number = 3;
    private maxLengthPseudo: number = 10;
    private maxLengthName: number = 30;

    constructor(
        public dialogRef: MatDialogRef<EditTagComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { tag: Tag; isNew: boolean; },
        private fb: FormBuilder,
        private tagService: TagService
    ) {
        // this.ctlId = this.fb.control('', []);
        this.ctlName = this.fb.control('',
            [
                Validators.required,
                Validators.minLength(this.minLengthPseudoPasswordName),
                Validators.maxLength(this.maxLengthPseudo),
                // this.forbiddenValues(['@', ' '])
            ], []
        );

        this.frm = this.fb.group({
            id: this.ctlId,
            name: this.ctlName,

        });
        console.log(data);
        this.isNew = data.isNew;
        this.frm.patchValue(data.tag);
    }

    forbiddenValues(arr: Array<string>): any {
        return (ctl: FormControl) => {
            arr.forEach(element => {
                if (ctl.value === element) {
                    return { forbiddenValue: { currentValue: ctl.value, forbiddenValue: element } };
                }
                return null;
            });
        };
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    update() {
        this.dialogRef.close(this.frm.value);

    }

    cancel() {
        this.dialogRef.close();
    }
}