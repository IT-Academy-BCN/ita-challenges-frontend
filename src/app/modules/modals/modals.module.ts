import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LoginModalComponent } from './login-modal/login-modal.component'
import { SendSolutionModalComponent } from './send-solution-modal/send-solution-modal.component'
import { FiltersModalComponent } from './filters-modal/filters-modal.component'
import { ReactiveFormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [
    LoginModalComponent,
    SendSolutionModalComponent,
    FiltersModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [
    LoginModalComponent,
    SendSolutionModalComponent,
    FiltersModalComponent
  ]
})
export class ModalsModule { }
