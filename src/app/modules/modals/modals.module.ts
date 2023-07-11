import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterModalComponent } from './register-modal/register-modal.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { FiltersModalComponent } from './filters-modal/filters-modal.component';



@NgModule({
  declarations: [
    RegisterModalComponent,
    LoginModalComponent,
    FiltersModalComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    RegisterModalComponent,
    FiltersModalComponent
  ]
})
export class ModalsModule { }
