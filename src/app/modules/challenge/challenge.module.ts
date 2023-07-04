import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from "../../shared/components/shared-components.module";
import { ChallengeRoutingModule } from './challenge-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ChallengeHeaderComponent } from './components/challenge-header/challenge-header.component';
import { ChallengeInfoComponent } from './components/challenge-info/challenge-info.component';
import { ChallengeContainerComponent } from './components/challenge-container/challenge-container.component';
import { DetailsComponent } from './components/challenge-info/details/details.component';
import { DetailsTextComponent } from './components/challenge-info/details/details-text/details-text.component';


@NgModule({
  declarations: [
  
    ChallengeHeaderComponent,
    ChallengeInfoComponent,
    ChallengeContainerComponent,
    DetailsComponent,
    DetailsTextComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    CoreModule,
    ChallengeRoutingModule,
    RouterModule,
    FormsModule
  ]
})
export class ChallengeModule { }
