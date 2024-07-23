import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common'
import { PaginationComponent } from './pagination/pagination.component'
import { ChallengeCardComponent } from './challenge-card/challenge-card.component'
import { ResourceCardComponent } from './resource-card/resource-card.component'
import { SolutionComponent } from './solution/solution.component'
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component'
import { TranslateModule } from '@ngx-translate/core'
import { DynamicTranslatePipe } from 'src/app/pipes/dynamic-translate.pipe'

@NgModule({
  declarations: [
    PaginationComponent,
    ChallengeCardComponent,
    ResourceCardComponent,
    SolutionComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NgbTooltipModule,
    DynamicTranslatePipe
  ],
  exports: [
    PaginationComponent,
    ChallengeCardComponent,
    ResourceCardComponent,
    SolutionComponent,
    BreadcrumbComponent
  ]
})
export class SharedComponentsModule { }
