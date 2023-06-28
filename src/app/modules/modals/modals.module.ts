import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterModalComponent } from './register-modal/register-modal.component';
import { LoginModalComponent } from './login-modal/login-modal.component';



@NgModule({
  declarations: [
    RegisterModalComponent,
    LoginModalComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    RegisterModalComponent
  ]
})
export class ModalsModule { }
