import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StarterRoutingModule} from "./starter-routing.module";
import {CoreModule} from "../../core/core.module";
import { StarterComponent } from './components/starter/starter.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {SharedComponentsModule} from "../../shared/components/shared-components.module";
import { StarterFiltersComponent } from './components/starter-filters/starter-filters.component';
import { ChallengeService } from 'src/app/services/challenge.service';
import { TranslateModule } from '@ngx-translate/core';
import { ModalsModule } from '../modals/modals.module';


@NgModule({
  declarations: [
    StarterComponent,
    StarterFiltersComponent,
  ],
  imports: [
    CommonModule,
    StarterRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedComponentsModule,
    TranslateModule,
    ModalsModule
  ],
  providers: [
    ChallengeService
  ]
})
export class StarterModule { }
