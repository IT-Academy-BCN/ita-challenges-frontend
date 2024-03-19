import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule, HttpClient} from "@angular/common/http";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CoreModule} from "./core/core.module";
import {StarterModule} from "./modules/starter/starter.module";
import {ChallengeModule} from "./modules/challenge/challenge.module";
import { I18nModule } from '../assets/i18n/i18n.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ProfileModule } from './modules/profile/profile.module';
import { AuthService } from './services/auth.service';
import {CookieEncryptionHelper} from "./helpers/cookie-encryption.helper";


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    NgbModule,
    HttpClientModule,
    StarterModule,
    ChallengeModule,
    ProfileModule,
    I18nModule,
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AuthService,
    CookieEncryptionHelper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
