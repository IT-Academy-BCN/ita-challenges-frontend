import { ChallengeComponent } from './components/challenge/challenge.component'
import { ChallengeHeaderComponent } from './components/challenge-header/challenge-header.component'
import { ChallengeInfoComponent } from './components/challenge-info/challenge-info.component'
import { ChallengeRoutingModule } from './challenge-routing.module'
import { CommonModule } from '@angular/common'
import { CoreModule } from 'src/app/core/core.module'
import { DynamicTranslatePipe } from '../../pipes/dynamic-translate.pipe'
import { EditorChallengeComponent} from './components/editor-challenge/editor-challenge.component'
import { FormsModule } from '@angular/forms'
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedComponentsModule } from '../../shared/components/shared-components.module'
import { TranslateModule } from '@ngx-translate/core'


import { ModalsModule } from '../modals/modals.module'
import { CustomDatePipe } from '../../pipes/custom-date.pipe'

@NgModule({
  declarations: [
    ChallengeHeaderComponent,
    ChallengeInfoComponent,
    ChallengeComponent,
    EditorChallengeComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    SharedComponentsModule,
    CoreModule,
    ChallengeRoutingModule,
    RouterModule,
    ModalsModule,
    TranslateModule,
    FormsModule,
    NgbNavModule,
    NgbTooltipModule,
    DynamicTranslatePipe,
    CustomDatePipe
]
})
export class ChallengeModule {}
