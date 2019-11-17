import { NgModule } from '@angular/core';
import {
  MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
  MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule,
  MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatTabsModule, 
  MatSelectModule, MatCardModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
    MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule,
    MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatTabsModule,
    MatSelectModule, MatCardModule
  ],
  exports: [
    MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
    MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule,
    MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatTabsModule,
    MatSelectModule, MatCardModule
  ],
})

export class SharedModule { }