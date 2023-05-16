import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CoreModule} from "./core/core.module";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {StarterModule} from "./modules/starter/starter.module";
import {ChallengeModule} from "./modules/challenge/challenge.module";
import {SharedComponentsModule} from "./shared/components/shared-components.module";

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
    ChallengeModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
