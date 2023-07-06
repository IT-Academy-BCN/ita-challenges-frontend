import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedComponentsModule} from "../../shared/components/shared-components.module";
import { ChallengeHeaderComponent } from './components/challenge-header/challenge-header.component';
import { ChallengeInfoComponent } from './components/challenge-info/challenge-info.component';
import { ChallengeComponent } from './components/challenge/challenge.component';
import { ChallengeRoutingModule } from './challenge-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ChallengeHeaderComponent,
    ChallengeInfoComponent,
    ChallengeComponent
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
