import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SendSolutionModalComponent } from './send-solution-modal/send-solution-modal.component'
import { FiltersModalComponent } from './filters-modal/filters-modal.component'
import { ReactiveFormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [
    SendSolutionModalComponent,
    FiltersModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [
    SendSolutionModalComponent,
    FiltersModalComponent
  ]
})
export class ModalsModule { }
