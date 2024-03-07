import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieEncryptionService } from './cookie-encryption/cookie-encryption.helper'



@NgModule({
  providers: [CookieEncryptionService],
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class HelperModule { }
