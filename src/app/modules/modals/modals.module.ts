import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SendSolutionModalComponent } from './send-solution-modal/send-solution-modal.component'
import { FiltersModalComponent } from './filters-modal/filters-modal.component'
import { RegisterUsersModalComponent } from './register-users-modal/register-users-modal.component'
import { DeleteChallengeModalComponent } from './delete-challenge-modal/delete-challenge-modal.component'
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SendSolutionModalComponent,
    FiltersModalComponent,
    RegisterUsersModalComponent,
    DeleteChallengeModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule
  ],
  exports: [
    SendSolutionModalComponent,
    FiltersModalComponent
  ]
})
export class ModalsModule { }
