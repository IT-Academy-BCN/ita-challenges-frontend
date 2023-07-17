import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';



@NgModule({
  declarations: [
    ProfileComponent,
    ProfileHeaderComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ProfileModule { }
