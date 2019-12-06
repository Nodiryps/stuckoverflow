import { Component, OnInit, ɵɵcontainerRefreshEnd } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { PostService } from '../../services/post.service';
import {
    FormBuilder, FormGroup, Validators, FormControl,
    AsyncValidatorFn, ValidationErrors
} from '@angular/forms';
import * as _ from 'lodash';
import { Post } from 'src/app/models/post';

@Component({
    selector: 'app-edit-post-mat',
    templateUrl: './edit-post.component.html',
    styleUrls: ['./edit-post.component.css']
})

export class EditPostComponent {

    //
    public frm: FormGroup;
    public ctlId: FormControl;
    public ctlTitle: FormControl;
    public ctlBody: FormControl;
    // public ctlTimeStamp: FormControl;
    // public ctlParentId: FormControl;
    // public ctlAuthorId: FormControl;
    // public ctlAcceptedAnswerId: FormControl;
    
    public isNew: boolean;

    // private minLengthPseudoPasswordName: number = 3;
    // private maxLengthPseudo: number = 10;
    // private maxLengthName: number = 30;

    constructor(
        public dialogRef: MatDialogRef<EditPostComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { post: Post; isNew: boolean; },
        private fb: FormBuilder,
        private postService: PostService
        
    ) {

        this.ctlTitle = this.fb.control('', [Validators.required]);
        this.ctlBody = this.fb.control('', [Validators.required]);



        this.frm = this.fb.group({
            id: this.ctlId,
            title: this.ctlTitle,
            body: this.ctlBody,
            // timestamp: this.ctlTimeStamp,
            // parentid: this.ctlParentId,
            // authorid: this.ctlAuthorId,
            // acceptedanswerid: this.ctlAcceptedAnswerId

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

    create() {
        this.postService.create(this.ctlTitle.value, this.ctlBody.value).subscribe();
    }
}