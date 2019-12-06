import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy, NgModule } from '@angular/core';
import {
    MatPaginator, MatSort, MatTableDataSource,
    MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar,
    PageEvent, MatSortHeader, MatTreeModule
} from '@angular/material';
import * as _ from 'lodash';
import { Post } from '../../models/post'
import { PostService } from '../../services/post.service';
import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { EditPostComponent } from '../edit-post/edit-post.component';

@Component({
    selector: 'app-postList',
    templateUrl: './postList.component.html',
    styleUrls: ['./postList.component.css']
})

export class PostListComponent implements AfterViewInit /*, OnDestroy */ {
    displayedColumns: string[] = ['vote', 'date', 'title', 'body'];
    dataSource: MatTableDataSource<Post> = new MatTableDataSource();
    filter: string;
    state: MatTableState;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    constructor(private postService: PostService, private stateService: StateService,
        public dialog: MatDialog, public snackBar: MatSnackBar) {
        this.state = this.stateService.postListState;
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: Post, filter: string) => {
            const str = data.votes + ' ' + data.timestamp + ' ' + data.title + ' ' + data.body;
            return str.toLowerCase().includes(filter);
        };
        this.state.bind(this.dataSource);
        this.refresh();
    }

    refresh() {
        this.postService.getAllPosts().subscribe(p => {
            // var tmp: Post[];
            // p.forEach(element => {
            //     if(element.title != null)
            //         tmp.push(element);
            // });
            this.dataSource.data = p;
            this.state.restoreState(this.dataSource);
            this.filter = this.state.filter;
        });
        // this.postService.getAllTags().subscribe(p => {
        //     this.dataSource.data.push(p);
        //     this.state.restoreState(this.dataSource);
        //     // this.filter = this.state.filter;
        // });
    }

    // appelée quand on clique sur le bouton "Create question"
    // create() {
    //     const post = new Post({});
    //     const dlg = this.dialog.open(EditPostComponent, { data: { post, isNew: true } });
    //     dlg.beforeClose().subscribe(res => {
    //         if (res) {
    //             this.dataSource.data = [...this.dataSource.data, new Post(res)];
    //             this.postService.add(res).subscribe(res => {
    //                 if (!res) {
    //                     this.snackBar.open(`There was an error at the server. 
    //                                         The question has not been created! Please try again.`,
    //                         'Dismiss', { duration: 10000 });
    //                     this.refresh();
    //                 } this.refresh();
    //             });
    //         }
    //     });
    // }

    filterChanged(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.state.filter = this.dataSource.filter;
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage();
    }
}