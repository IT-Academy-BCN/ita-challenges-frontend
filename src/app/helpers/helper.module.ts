import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieEncryptionService } from './cookie-encryption/cookie-encryption.service'



@NgModule({
  providers: [CookieEncryptionService],
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class HelperModule { }
