import { NgModule } from '@angular/core';
import {
  MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
  MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule,
  MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatTabsModule, 
  MatSelectModule, MatCardModule, MatListModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
    MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule,
    MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatTabsModule,
    MatSelectModule, MatCardModule, MatListModule
  ],
  exports: [
    MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
    MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule,
    MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatTabsModule,
    MatSelectModule, MatCardModule, MatListModule
  ],
})

export class SharedModule { }