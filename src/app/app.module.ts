import { LOCALE_ID, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { CoreModule } from './core/core.module'
import { StarterModule } from './modules/starter/starter.module'
import { ChallengeModule } from './modules/challenge/challenge.module'
import { I18nModule } from '../assets/i18n/i18n.module'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { ProfileModule } from './modules/profile/profile.module'
import { AuthService } from './services/auth.service'

// TODO - pending execution over secure environment
// import { CookieEncryptionHelper } from './helpers/cookie-encryption.helper'

import localeEs from '@angular/common/locales/es'
import localeCa from '@angular/common/locales/ca'
import localeEn from '@angular/common/locales/en'
import { registerLocaleData } from '@angular/common'

registerLocaleData(localeEs, 'es')
registerLocaleData(localeCa, 'ca')
registerLocaleData(localeEn, 'en')

export function HttpLoaderFactory (http: HttpClient): any {
  return new TranslateHttpLoader(http)
}

@NgModule({
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent],
  imports: [BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    NgbModule,
    StarterModule,
    ChallengeModule,
    ProfileModule,
    I18nModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ca',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })],
  providers: [
    AuthService, // CookieEncryptionHelper

    provideHttpClient(withInterceptorsFromDi()),
    { provide: LOCALE_ID, useValue: 'ca' } // Establecemos Catalán como idioma por defecto.
  ]
})
export class AppModule { }
