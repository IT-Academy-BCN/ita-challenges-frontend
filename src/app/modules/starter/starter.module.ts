import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MainComponent} from "../../core/layout/main/main.component";
import {StarterRoutingModule} from "./starter-routing.module";
import {CoreModule} from "../../core/core.module";

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    StarterRoutingModule,
    CoreModule
  ]
})
export class StarterModule { }
