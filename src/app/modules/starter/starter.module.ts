import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MainComponent} from "../../core/layout/main/main.component";
import {StarterRoutingModule} from "./starter-routing.module";
import {CoreModule} from "../../core/core.module";
import { StarterComponent } from './starter/starter.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {ChallengeComponent} from "../../shared/components/challenge/challenge.component";
import {SharedComponentsModule} from "../../shared/components/shared-components.module";

@NgModule({
  declarations: [
    StarterComponent
  ],
  imports: [
    CommonModule,
    StarterRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedComponentsModule
  ]
})
export class StarterModule { }
