import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MainComponent} from "../../core/layout/main/main.component";
import {StarterRoutingModule} from "./starter-routing.module";
import {CoreModule} from "../../core/core.module";
import { StarterComponent } from './starter/starter.component';
import { ChallengeComponent } from 'src/app/shared/components/challenge/challenge.component';

@NgModule({
  declarations: [
    StarterComponent,
    ChallengeComponent
  ],
  imports: [
    CommonModule,
    StarterRoutingModule,
    CoreModule
  ]
})
export class StarterModule { }
