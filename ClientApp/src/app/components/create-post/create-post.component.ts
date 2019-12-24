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
                // Validators.minLength(this.minLengthPseudoPasswordName), 
                // Validators.maxLength(this.maxLengthPseudo),
                // Validators.pattern(/^[a-z]+[a-z0-9._]/),
                // this.forbiddenValue('@')
            ]
        );

        this.ctlBody = this.fb.control('',
            [
                Validators.required,
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
        this.ctlTagSelect.value.forEach(t => {
            this.tags.forEach(elm => {
                console.log("elems: " + elm.name);
                console.log("ttt: " + t);
                if (elm.name === t) {
                    post.tags.push(elm);
                    let pt = new PostTag({});
                    pt.postId = post.id;
                    pt.tagId = elm.id;
                    post.postTags.push(pt);
                    console.log("foreach: " + pt);
                }
            });
            // console.log(typeof t);
            // let tag = new Tag({});
            // tag.name = t;

            // post.tags.push(tag);
            // let pt = new PostTag({});
            // pt.postId = post.id;
            // pt.tagId = tag.id;
            // console.log(tag.id);
            // post.postTags.push(pt);
        });
        console.log("postTags: " + post.tags.toString);

        this.postService.add(post).subscribe(() => {

            //this.showDetail(post);
            this.router.navigate(['./postDetail/1']);
        });
    }


    showDetail(post: Post) {
        this.postService.setPostDetail(post);
        this.router.navigate([`/postdetail`]);
    }
}