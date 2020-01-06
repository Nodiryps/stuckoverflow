import { Component, ViewChild, AfterViewInit } from '@angular/core';
import {
    MatPaginator, MatSort, MatTableDataSource,
    MatDialog, MatSnackBar
} from '@angular/material';
import * as _ from 'lodash';
import { Post } from '../../models/post'
import { PostService } from '../../services/post.service';
import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { reject } from 'q';
import { element } from 'protractor';
import { User, Role } from 'src/app/models/user';

@Component({
    selector: 'app-postList',
    templateUrl: './postList.component.html',
    styleUrls: ['./postList.component.css']
})

export class PostListComponent implements AfterViewInit /*, OnDestroy */ {
    displayedColumns: string[] = ['score', 'timestamp', 'title', 'tags', 'action'];
    dataSource: MatTableDataSource<Post> = new MatTableDataSource();
    filter: string;
    state: MatTableState;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    toggleBtnOptions: string[] = ['Newest', 'Votes', 'Unanswered', 'Tag']
    selectedValue: string = this.toggleBtnOptions[0];
    unanswered: Post[] = []; //Posts du dataSource sans réponses
    currUser: User;

    constructor(
        private postService: PostService,
        private stateService: StateService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private authService: AuthenticationService,
        private router: Router
    ) {
        this.state = this.stateService.postListState;
        this.currUser = authService.currentUser;
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: Post, filter: string) => {
            const str = data.votes + ' ' + data.timestamp + ' ' +
                data.title + ' ' + data.body + ' ' + data.tags;
            return str.toLowerCase().includes(filter);
        };
        this.state.bind(this.dataSource);
        this.refresh();

        // this.showUnanswered();

    }

    refresh() {
        this.postService.getAllQuestions().subscribe(p => {
            this.dataSource.data = p;
            if (this.selectedValue === 'Newest')
                this.state = this.stateService.postListState = new MatTableState('timestamp', 'desc', 5);
            else if (this.selectedValue === 'Votes') {
                this.state = this.stateService.postListState = new MatTableState('votes', 'desc', 5);
            }
            else if (this.selectedValue === 'Unanswered')
                this.dataSource.data = _.filter(this.dataSource.data, p => p.acceptedAnswerId === null);
            else if (this.selectedValue === 'Tag')
                this.dataSource.data = _.filter(this.dataSource.data, p => p.tags.length > 0);

            this.state.restoreState(this.dataSource);
            this.filter = this.state.filter;

            //     this.dataSource.data.forEach(element => {
            //         this.postService.getAllQuestionsUnanswered(element.id).subscribe(a => {
            //             element.answers = a;
            //             if (element.answers.length === 0) {
            //                 this.unanswered.push(element);
            //             }
            //         });
            //     });
            //     console.log(this.unanswered);
        });
    }

    showUnanswered() {
        this.dataSource.data = this.unanswered;
    }

    selectionChanged(item) {
        this.selectedValue = item;
        this.refresh();
    }

    showDetail(post: Post) {
        this.postService.setPostDetail(post);
        this.router.navigate([`/postdetail`]);
    }

    delete(post: Post) {
        if (this.authService.isAdmin() 
            || this.authorDeleteRulesOk(post)) {
            const backup = this.dataSource.data;
            this.dataSource.data = _.filter(this.dataSource.data, p => p.id !== post.id);
            const snackBarRef = this.snackBar.open(`Post '${post.title}' will be deleted`, 'Undo', { duration: 10000 });
            snackBarRef.afterDismissed().subscribe(res => {
                if (!res.dismissedByAction) {
                    this.postService.delete(post).subscribe();
                    this.router.navigate(['/']);
                    this.refresh();
                }
                else
                    this.dataSource.data = backup;
            });
        }
    }

    authorDeleteRulesOk(post: Post) {
        if (this.authService.isTheAuthorOfAPost(post)) {
            if (this.isAnAnswer(post))
                return this.hasNoComments(post);
            else {
                return this.hasNoComments(post) 
                    && this.hasNoAnswers(post);
            }
        } return false;
    }

    isAnAnswer(post: Post) {
        return post.title === null;
    }

    hasNoAnswers(post: Post) {
        this.dataSource.data.some(p => {
            return p.parentId !== post.id;
        });
        return false;
    }

    hasNoComments(post: Post) {
        return post.comments.length === 0;
    }

    filterChanged(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.state.filter = this.dataSource.filter;
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage();
    }

    create() {
        if (this.currUser.role == Role.Admin || this.currUser.role == Role.Member) {
            const post = new Post({});
            const dlg = this.dialog.open(EditPostComponent, { data: { post, isNew: true } });
            dlg.beforeClose().subscribe(res => {
                if (res) {
                    this.dataSource.data = [...this.dataSource.data, new Post(res)];
                    this.postService.add(res).subscribe(res => {
                        if (!res) {
                            this.snackBar.open(`There was an error at the server. 
                                                The post has not been created! Please try again.`,
                                'Dismiss', { duration: 10000 });
                            this.refresh();
                        } this.refresh();
                    });
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.snackBar.dismiss();
    }
}