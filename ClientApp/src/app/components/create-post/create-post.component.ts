import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { resolve } from 'path';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.css']
})

export class CreatePostComponent {
    public frm: FormGroup;
    public ctlTitle: FormControl;
    public ctlBody: FormControl;

    constructor(
        public postService: PostService,  // pour pouvoir faire le login
        public router: Router,           // pour rediriger vers la page d'accueil en cas de login
        private fb: FormBuilder,        // pour construire le formulaire, du côté TypeScript
        private authenticationService: AuthenticationService
    ) {
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

        this.frm = this.fb.group({
            title: this.ctlTitle,
            body: this.ctlBody,
        });
    }

    create() {
        const post = new Post({});
        post.title = this.ctlTitle.value;
        post.body = this.ctlBody.value;
        //post.timestamp = Date.now.toString();
        post.parentId = post.id;
        post.authorId = this.authenticationService.currentUser.id;

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