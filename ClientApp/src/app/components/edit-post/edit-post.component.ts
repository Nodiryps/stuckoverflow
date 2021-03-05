
import { Component, OnInit, ɵɵcontainerRefreshEnd } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Inject } from '@angular/core';
import { PostService } from '../../services/post.service';
import { FormBuilder, FormGroup, Validators, FormControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import * as _ from 'lodash';
import { Post } from 'src/app/models/post';
import { Router } from '@angular/router';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { Tag } from 'src/app/models/tag';
import { PostTag } from 'src/app/models/postTag';
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
    public ctlTagSelect: FormControl;

    public tags: Tag[] = [];
    //public postTags: PostTag[] = [];
    public selectedTags: Tag[] = [];

    private minLengthTitle = 2;
    private maxLengthTitle = 300;
    private minLengthBody = 2;
    private maxLengthBody = 2000;

    public isNew: boolean;
    public isAnswer: boolean;

    constructor(
        public dialogRef: MatDialogRef<EditPostComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { post: Post; isNew: boolean; isAnswer: boolean }, private fb: FormBuilder,
        public postService: PostService,
        public router: Router,
    ) {
        this.isAnswer = data.isAnswer;

        this.postService.getAllTags().subscribe(t => this.tags = t);
        this.ctlTagSelect = this.fb.control('', []);

        this.data.post.tags.forEach(element => {
            this.selectedTags.push(element);
        });

        this.ctlTitle = this.fb.control('',
            [
                Validators.minLength(this.minLengthTitle),
                Validators.maxLength(this.maxLengthTitle),
            ]
        );

        this.ctlBody = this.fb.control('',
            [
                Validators.required,
                Validators.minLength(this.minLengthBody),
                Validators.maxLength(this.maxLengthBody),
            ]
        );

        this.frm = this.fb.group({
            id: this.ctlId,
            title: this.ctlTitle,
            body: this.ctlBody,
            tags: this.ctlTagSelect
        }
            // { validator: this.isTitleRequired }
        );
        console.log(data);
        this.isNew = data.isNew;
        this.frm.patchValue(data.post);
    }

    public objectComparisonFunction = function (option, value): boolean {
        return option.name === value.name;
    }
    // isTitleRequired(group: FormGroup): ValidationErrors {
    //     if (!group.value) { return null; }

    //     if (!this.isAnswer)
    //         return { titleRequired: true };
    // }

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
