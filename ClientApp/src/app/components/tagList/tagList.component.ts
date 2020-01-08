import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import * as _ from 'lodash';
import { Tag } from '../../models/tag';
import { TagService } from '../../services/tag.service';
import { EditTagComponent } from '../edit-tag/edit-tag.component';
import { TagQuestionsComponent } from '../tagQuestions/tagQuestions.component';
import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/user';

@Component({
    selector: 'app-taglist',
    templateUrl: './taglist.component.html',
    styleUrls: ['./taglist.component.css']
})

export class TagListComponent implements AfterViewInit, OnDestroy {
    displayedColumns: string[] = ['id', 'name', 'nbOcc'];
    dataSource: MatTableDataSource<Tag> = new MatTableDataSource();
    filter: string;
    state: MatTableState;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    currUser: User;
    isAdmin: boolean;

    constructor(
        private tagService: TagService,
        private stateService: StateService, private router: Router,
        public dialog: MatDialog, public snackBar: MatSnackBar,
        private authService: AuthenticationService) {
        this.state = this.stateService.tagListState;
        this.currUser = authService.currentUser;
        this.isAdmin = authService.isAdmin();
        if (this.isAdmin)
            this.displayedColumns.push('actions');
    }

    ngAfterViewInit(): void {
        // lie le datasource au sorter et au paginator
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // définit le predicat qui doit être utilisé pour filtrer les membres
        this.dataSource.filterPredicate = (data: Tag, filter: string) => {
            const str = data.id + ' ' + data.name;
            return str.toLowerCase().includes(filter);
        };
        // établit les liens entre le data source et l'état de telle sorte que chaque fois que 
        // le tri ou la pagination est modifié l'état soit automatiquement mis à jour
        this.state.bind(this.dataSource);
        // récupère les données 
        this.refresh();
    }

    refresh() {
        this.tagService.getAll().subscribe(tags => {
            // assigne les données récupérées au datasource
            this.dataSource.data = tags;
            // restaure l'état du datasource (tri et pagination) à partir du state
            this.state.restoreState(this.dataSource);
            // restaure l'état du filtre à partir du state
            this.filter = this.state.filter;
        });
    }

    // appelée chaque fois que le filtre est modifié par l'utilisateur
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

    getTagQuestions(tag: Tag) {
        this.tagService.setTagQuestionsTag(tag);
        this.router.navigate([`/tagQuestions`]);
        // const dlg = this.dialog.open(TagQuestionsComponent, { data:{tag} });
        // dlg.beforeClose().subscribe(res => {
        //     if(res) {
        //         _.assign(tag, res);
        //         this.tagService.getPostsByTagId(res).subscribe(res => {
        //             if (!res) {
        //                 this.snackBar.open(`There was an error at the server. The GET has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
        //                 this.refresh();
        //             }
        //         });
        //     }
        // });
    }

    // appelée quand on clique sur le bouton "edit" d'un membre
    edit(tag: Tag) {
        const dlg = this.dialog.open(EditTagComponent, { data: { tag, isNew: false }, height: "800px", width: "600px" });
        dlg.beforeClose().subscribe(res => {
            if (res) {
                _.assign(tag, res);
                this.tagService.update(res).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
                        this.refresh();
                    }
                });
            }
        });
    }

    // appelée quand on clique sur le bouton "delete" d'un membre
    delete(tag: Tag) {
        const backup = this.dataSource.data;
        this.dataSource.data = _.filter(this.dataSource.data, u => u.id !== tag.id);
        const snackBarRef = this.snackBar.open(`Tag '${tag.name}' will be deleted`, 'Undo', { duration: 10000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction)
                this.tagService.delete(tag).subscribe();
            else
                this.dataSource.data = backup;
        });
    }

    // appelée quand on clique sur le bouton "new tag"
    create() {
        const tag = new Tag({});
        const dlg = this.dialog.open(EditTagComponent, { data: { tag, isNew: true }, height: "800px", width: "600px" });
        dlg.beforeClose().subscribe(res => {
            if (res) {
                this.dataSource.data = [...this.dataSource.data, new Tag(res)];
                this.tagService.add(res).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. 
                                            The tag has not been created! Please try again.`,
                            'Dismiss', { duration: 10000 });
                        this.refresh();
                    } this.refresh();
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.snackBar.dismiss();
    }
}
