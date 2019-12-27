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

@Component({
    selector: 'app-postList',
    templateUrl: './postList.component.html',
    styleUrls: ['./postList.component.css']
})

export class PostListComponent implements AfterViewInit /*, OnDestroy */ {
    displayedColumns: string[] = ['vote', 'date', 'title', 'body', 'action'];
    dataSource: MatTableDataSource<Post> = new MatTableDataSource();
    filter: string;
    state: MatTableState;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    constructor(private postService: PostService,
         private stateService: StateService,
        public dialog: MatDialog,
         public snackBar: MatSnackBar,
         private authenticationService: AuthenticationService,
          private router: Router) {
        this.state = this.stateService.postListState;
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
    }

    refresh() {
        this.postService.getAllQuestions().subscribe(p => {
            this.dataSource.data = p;
            this.state.restoreState(this.dataSource);
            this.filter = this.state.filter;

        });
    }

    showDetail(post: Post) {
        this.postService.setPostDetail(post);
        this.router.navigate([`/postdetail`]);
    }

    delete(post: Post) {
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

    filterChanged(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.state.filter = this.dataSource.filter;
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage();
    }

    create() {
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
                    }this.refresh();
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.snackBar.dismiss();
    }
}