import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProfileComponent } from './components/profile/profile.component'
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component'
import { RouterModule } from '@angular/router'
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module'

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedComponentsModule
  ]
})
export class ProfileModule { }
