import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="confirm-dialog">
    <h2 mat-dialog-title>Remove Quiz</h2>
    <mat-dialog-content>Are you sure you want to remove this quiz?</mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-stroked-button (click)="onNoClick()">No</button>
      <button mat-button mat-flat-button color="warn" (click)="onYesClick()">Yes</button>
    </mat-dialog-actions>
    </div>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
