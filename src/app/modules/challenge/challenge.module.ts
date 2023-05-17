import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedComponentsModule} from "../../shared/components/shared-components.module";
import { ChallengeHeaderComponent } from './challenge-header/challenge-header.component';
import { ChallengeContainerComponent } from './challenge-container/challenge-container.component';
import { ChallengeRoutingModule } from './challenge-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule } from '@angular/router';
import { ChallengeInfoComponent } from './challenge-info/challenge-info.component';



@NgModule({
  declarations: [
    ChallengeHeaderComponent,
    ChallengeContainerComponent,
    ChallengeInfoComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    CoreModule,
    ChallengeRoutingModule,
    RouterModule,
  ]
})
export class ChallengeModule { }
