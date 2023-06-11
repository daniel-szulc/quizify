import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-avatar-dialog',
  template: `
    <div mat-dialog-content>
      <h1 mat-dialog-title>Select your avatar</h1>
      <div class="avatars">
        <img *ngFor="let avatar of avatars; index as i"
             [src]="'assets/avatars/avatar_' + avatar.padStart(2, '0') + '.jpg'"
             (click)="selectAvatar(avatar)">
      </div>
      <mat-dialog-actions>
      <button mat-stroked-button (click)="dialogRef.close()">Cancel</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    h1
      font-size: 1.5em !important
      font-weight: 600 !important
      padding-bottom: 25px !important
    div
      text-align: center
    .avatars
      display: flex
      flex-wrap: wrap
      justify-content: center
      gap: 15px
    .avatars img
      width: 100px
      height: 100px
      aspect-ratio: 1
      cursor: pointer
    mat-dialog-actions
      justify-content: center
      button
        margin-top: 10px
  `]
})
export class AvatarDialogComponent {
  avatars = Array.from({length: 21}, (_, i) => i.toString());

  constructor(
    public dialogRef: MatDialogRef<AvatarDialogComponent>
  ) {}

  selectAvatar(i: string) {
    this.dialogRef.close('assets/avatars/avatar_' + i.padStart(2, '0') + '.jpg');
  }
}
