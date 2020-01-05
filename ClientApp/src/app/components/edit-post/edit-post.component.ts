import { Component, OnInit, ɵɵcontainerRefreshEnd } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Inject } from '@angular/core';
import { PostService } from '../../services/post.service';
import { FormBuilder, FormGroup, Validators, FormControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import * as _ from 'lodash';
import { Post } from 'src/app/models/post';
import { Router } from '@angular/router';
import { MatTableState } from 'src/app/helpers/mattable.state';
//import { post } from 'selenium-webdriver/http';


@Component({
    selector: 'app-edit-post-mat',
    templateUrl: './edit-post.component.html',
    styleUrls: ['./edit-post.component.css']
})

export class EditPostComponent {
    public frm: FormGroup;
    public ctlId: FormControl;
    public ctlTitle: FormControl;
    public ctlBody: FormControl;
    public isNew: boolean;
    public isAnswer: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<EditPostComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { post: Post; isNew: boolean; isAnswer: boolean }, private fb: FormBuilder,
        public postService: PostService,
        public router: Router,
    ) {
        this.isAnswer = data.isAnswer;
        this.ctlTitle = this.fb.control('',
            [
                //Ajouter une condition sur ce validator if(!isComment && !isAnswer)
                //Validators.required, 
            ]
        );

        this.ctlBody = this.fb.control('',
            [
                Validators.required,
            ]
        );

        this.frm = this.fb.group({
            id: this.ctlId,
            title: this.ctlTitle,
            body: this.ctlBody,
        });
        console.log(data);
        this.isNew = data.isNew;
        this.frm.patchValue(data.post);
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