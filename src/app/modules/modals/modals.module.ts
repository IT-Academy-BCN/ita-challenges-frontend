import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterModalComponent } from './register-modal/register-modal.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { SendSolutionModalComponent } from './send-solution-modal/send-solution-modal.component';
import { RestrictedModalComponent } from './restricted-modal/restricted-modal.component';



@NgModule({
  declarations: [
    RegisterModalComponent,
    LoginModalComponent,
    SendSolutionModalComponent,
    RestrictedModalComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    RegisterModalComponent,
    LoginModalComponent,
    RestrictedModalComponent
  ]
})
export class ModalsModule { }
