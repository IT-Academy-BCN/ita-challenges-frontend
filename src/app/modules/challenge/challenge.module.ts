import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengeComponent } from '../../shared/components/challenge/challenge.component';
import {SharedComponentsModule} from "../../shared/components/shared-components.module";



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedComponentsModule
  ]
})
export class ChallengeModule { }
