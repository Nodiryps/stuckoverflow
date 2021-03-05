import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { AuthenticationService } from '../../services/authentication.service';
import { reject } from 'q';
import { Post } from 'src/app/models/post';
import { Tag } from 'src/app/models/tag';
import { PostTag } from 'src/app/models/postTag';
import { equal } from 'assert';

@Component({
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.css']
})

export class CreatePostComponent {
    public frmGp: FormGroup;
    public ctlTitle: FormControl;
    public ctlBody: FormControl;
    public ctlTagSelect: FormControl;
    public tags: Tag[] = [];
    public postTags: PostTag[] = [];
    public selectedTags: Tag[] = [];
    private minLengthTitle = 2;
    private maxLengthTitle = 300;
    private minLengthBody = 2;
    private maxLengthBody = 2000;

    constructor(
        public postService: PostService,  // pour pouvoir faire le login
        public router: Router,           // pour rediriger vers la page d'accueil en cas de login
        private fb: FormBuilder,        // pour construire le formulaire, du côté TypeScript
        private authenticationService: AuthenticationService
    ) {
        // this.getAllTags();
        this.postService.getAllTags().subscribe(t => this.tags = t);

        this.ctlTagSelect = this.fb.control('', []);

        this.ctlTitle = this.fb.control('',
            [
                Validators.required,
                Validators.minLength(this.minLengthTitle),
                Validators.maxLength(this.maxLengthTitle),
                // Validators.pattern(/^[a-z]+[a-z0-9._]/),
                // this.forbiddenValue('@')
            ]
        );

        this.ctlBody = this.fb.control('',
            [
                Validators.required,
                Validators.minLength(this.minLengthBody),
                Validators.maxLength(this.maxLengthBody),
                // Validators.pattern(/^[a-z]+[a-z0-9._]/),
                // Validators.minLength(this.minLengthPseudoPasswordName)
            ]
        );

        this.frmGp = this.fb.group({
            title: this.ctlTitle,
            body: this.ctlBody,
            tagSelect: this.ctlTagSelect
        });
    }

    getAllTags() {
        let timeout: NodeJS.Timeout;
        clearTimeout(timeout);
        return new Promise(resolve => {
            timeout = setTimeout(() => {
                this.postService.getAllTags().subscribe(t => this.tags = t);
            }, 300);
        })
    }

    create() {
        const post = new Post({});

        post.title = this.ctlTitle.value;
        post.body = this.ctlBody.value;
        post.authorId = this.authenticationService.currentUser.id;
        post.tags = [];
        post.postTags = [];
        if (this.ctlTagSelect.value !== '') {
            this.ctlTagSelect.value.forEach(t => {
                this.tags.forEach(elm => {
                    if (elm.name === t) {
                        post.tags.push(elm);
                        let pt = new PostTag({});
                        pt.postId = post.id;
                        pt.tagId = elm.id;
                        post.postTags.push(pt);
                    }
                });
            });
        }

        this.postService.add(post).subscribe(() => {
            //this.showDetail(post);
            this.postService.post = null;
            this.router.navigate(['./postdetail']);
        });

    }


    showDetail(post: Post) {
        this.postService.setPostDetail(post);
        this.router.navigate([`/postdetail`]);
    }
}