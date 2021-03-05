import { Component, OnInit, ɵɵcontainerRefreshEnd } from '@angular/core';
import { PostService } from '../../services/post.service';
import * as _ from 'lodash';
import { Post } from 'src/app/models/post';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/user';
//import { post } from 'selenium-webdriver/http';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    // styleUrls: ['./profile.component.css']
})

export class ProfileComponent {
    currUser: User;
    questions: Post[] = [];
    answers: Post[] = [];
    comments: Comment[] = [];

    constructor(
        private authService: AuthenticationService,
        private postService: PostService,
    ) {
        this.currUser = authService.currentUser;
        postService.getPostsByUserId(this.currUser.id).subscribe(posts => {
            posts.forEach(p => {
                if (this.isAnAnswer(p))
                    this.answers.push(p);
                else
                    this.questions.push(p);
            });

        })

    }

    private isAnAnswer(post: Post) {
        return post.title === null;
    }
}