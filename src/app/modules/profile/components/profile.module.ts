import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';


@NgModule({
  declarations: [
            ProfileHeaderComponent,
            ProfileComponent
            ],
  imports: [
            CommonModule
          ]
})
export class ProfileModule { }
