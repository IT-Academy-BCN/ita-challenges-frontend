import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterModalComponent } from './register-modal/register-modal.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { FilterModalComponent } from './filter-modal/filter-modal.component';



@NgModule({
  declarations: [
    RegisterModalComponent,
    LoginModalComponent,
    FilterModalComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    RegisterModalComponent,
    FilterModalComponent
  ]
})
export class ModalsModule { }
