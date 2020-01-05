import { Component, OnInit, ɵɵcontainerRefreshEnd } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Inject } from '@angular/core';
import { PostService } from '../../services/post.service';
import { FormBuilder, FormGroup, Validators, FormControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import * as _ from 'lodash';
import { Post } from 'src/app/models/post';
import { Comment } from 'src/app/models/comment';
import { Router } from '@angular/router';
import { MatTableState } from 'src/app/helpers/mattable.state';
//import { post } from 'selenium-webdriver/http';


@Component({
    selector: 'app-edit-comment-mat',
    templateUrl: './edit-comment.component.html',
    styleUrls: ['./edit-comment.component.css']
})

export class EditCommentComponent {
    public frm: FormGroup;
    //public ctlId: FormControl;

    public ctlBody: FormControl;
    public isNew: boolean;
    public isComment: boolean;
    public isAnswer: boolean;

    constructor(
        public dialogRef: MatDialogRef<EditCommentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { comment: Comment; isNew: boolean; isComment: boolean, isAnswer: boolean },
        private fb: FormBuilder,
        public postService: PostService,
        public router: Router,
    ) {
        this.ctlBody = this.fb.control('',
            [
                Validators.required,
            ]
        );

        this.frm = this.fb.group({
            //id: this.ctlId,
            body: this.ctlBody,
        });
        console.log(data);
        this.isNew = data.isNew;
        if (!this.isNew) {
            this.frm.patchValue(data.comment);
        }
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