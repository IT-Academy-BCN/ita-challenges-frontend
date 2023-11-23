import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterModalComponent } from './register-modal/register-modal.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { SendSolutionModalComponent } from './send-solution-modal/send-solution-modal.component';
import { RestrictedModalComponent } from './restricted-modal/restricted-modal.component';
import { FiltersModalComponent } from './filters-modal/filters-modal.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    RegisterModalComponent,
    LoginModalComponent,
    SendSolutionModalComponent,
    RestrictedModalComponent,
    FiltersModalComponent
  ],
  imports: [
    CommonModule, ReactiveFormsModule
  ],
  exports: [
    RegisterModalComponent,
    LoginModalComponent,
    SendSolutionModalComponent,
    RestrictedModalComponent,
    FiltersModalComponent
  ]
})
export class ModalsModule { }
