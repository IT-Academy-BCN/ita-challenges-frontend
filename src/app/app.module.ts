import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from "@angular/common/http";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CoreModule} from "./core/core.module";
<<<<<<< HEAD
import {FormsModule} from "@angular/forms";
import {HttpClientModule, HttpClient} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {StarterModule} from "./modules/starter/starter.module";
import {ChallengeModule} from "./modules/challenge/challenge.module";
import {SharedComponentsModule} from "./shared/components/shared-components.module";
import { I18nModule } from 'src/assets/i18n/i18n.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

=======
import {StarterModule} from "./modules/starter/starter.module";
import {ChallengeModule} from "./modules/challenge/challenge.module";
>>>>>>> c6f5bd08bad30ad02e45510fb02d248f9ba6b5f5

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    NgbModule,
    HttpClientModule,
    StarterModule,
<<<<<<< HEAD
    ChallengeModule, 
    I18nModule,
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
=======
    ChallengeModule,
>>>>>>> c6f5bd08bad30ad02e45510fb02d248f9ba6b5f5
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
