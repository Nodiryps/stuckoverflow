import { Component, ViewChild, AfterViewInit, Inject } from '@angular/core';
import {
    MatPaginator, MatSort, MatTableDataSource,
    MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef
} from '@angular/material';
import * as _ from 'lodash';
import { Post } from '../../models/post'
import { User, Role } from 'src/app/models/user';
import { Tag } from 'src/app/models/tag';
import { TagService } from '../../services/tag.service';
import { PostService } from 'src/app/services/post.service';
import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-tagQuestions',
    templateUrl: './tagQuestions.component.html',
    // styleUrls: ['./tagQuestions.component.css']
})

export class TagQuestionsComponent implements AfterViewInit {
    displayedColumns: string[] = ['score', 'timestamp', 'title', 'action'];
    dataSource: MatTableDataSource<Post> = new MatTableDataSource();
    filter: string;
    state: MatTableState;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    currUser: User;
    selectedTag: Tag = new Tag({});

    constructor(
        // public dialogRef: MatDialogRef<TagQuestionsComponent>,
        // @Inject(MAT_DIALOG_DATA) public data: { tag: Tag; },
        private postService: PostService,
        private tagService: TagService,
        private stateService: StateService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        authenticationService: AuthenticationService,
        private router: Router
    ) {
        this.state = this.stateService.tagQuestionsState;
        this.currUser = authenticationService.currentUser;
        this.selectedTag = tagService.tag;
    }

    ngAfterViewInit(): void {
        this.tagService.getPostsByTagId(this.selectedTag).subscribe(p => {
            this.dataSource.data = p;
            p.forEach(post => {
                console.log("posts: " + post.id)
            })
            this.state.restoreState(this.dataSource);
            this.filter = this.state.filter;
        });

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: Post, filter: string) => {
            const str = data.votes + ' ' + data.timestamp + ' ' +
                data.title;
            return str.toLowerCase().includes(filter);
        };
        this.state.bind(this.dataSource);
        this.refresh();
    }

    refresh() {
        this.tagService.getPostsByTagId(this.selectedTag).subscribe(p => {
            this.dataSource.data = p;
            p.forEach(post => {
                console.log("posts: " + post.id)
            })
            this.state.restoreState(this.dataSource);
            this.filter = this.state.filter;
        });
    }

    showDetail(post: Post) {
        this.postService.setPostDetail(post);
        this.router.navigate([`/postdetail`]);
    }

    filterChanged(filterValue: string) {
        // applique le filtre au datasource (et provoque l'utilisation du filterPredicate)
        this.dataSource.filter = filterValue.trim().toLowerCase();
        // sauve le nouveau filtre dans le state
        this.state.filter = this.dataSource.filter;
        // comme le filtre est modifié, les données aussi et on réinitialise la pagination
        // en se mettant sur la première page
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage();
    }
    
    // onNoClick(): void {
    //     this.dialogRef.close();
    // }

    // cancel() {
    //     this.dialogRef.close();
    // }
}