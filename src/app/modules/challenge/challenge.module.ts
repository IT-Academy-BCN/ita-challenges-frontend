import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'src/app/core/core.module';
import { SharedComponentsModule } from "../../shared/components/shared-components.module";
import { ChallengeRoutingModule } from './challenge-routing.module';
import { ChallengeHeaderComponent } from './challenge-header/challenge-header.component';
import { ChallengeContainerComponent } from './challenge-container/challenge-container.component';



@NgModule({
  declarations: [
    ChallengeHeaderComponent,
    ChallengeContainerComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    ChallengeRoutingModule,
    RouterModule,
    SharedComponentsModule
  ]
})
export class ChallengeModule { }
