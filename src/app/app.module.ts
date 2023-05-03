import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CoreModule} from "./core/core.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StarterModule } from './modules/starter/starter.module';
//import {CustomDateAdapter} from "./helpers/CustomDateAdapter";

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
    StarterModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    /* { provide: DateAdapter, useClass: CustomDateAdapter}*/ //Adapter de dia de semana para Angular Material
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
