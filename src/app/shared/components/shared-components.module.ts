import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common'
import { ChallengeCardComponent } from './challenge-card/challenge-card.component'
import { ResourceCardComponent } from './resource-card/resource-card.component'
import { SolutionComponent } from './solution/solution.component'
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component'
import { TranslateModule } from '@ngx-translate/core'
import { DynamicTranslatePipe } from 'src/app/pipes/dynamic-translate.pipe'
import { EscapeJavaForJsonPipe } from '../../pipes/escape-java-chars.pipe'
import { FormsModule } from '@angular/forms'
import { EditorModule } from '@tinymce/tinymce-angular'
import { ToggleComponent } from './toggle/toggle.component'
import { CustomDatePipe } from "../../pipes/custom-date.pipe";
import { DifficultyLevelComponent } from './challenge-card/difficulty-level/difficulty-level.component'
import { TagsComponent } from './challenge-card/tags/tags.component'
import { LoadingCardComponent } from './loading-card/loading-card.component'

@NgModule({
  declarations: [
    ChallengeCardComponent,
    LoadingCardComponent,
    ResourceCardComponent,
    SolutionComponent,
    BreadcrumbComponent,
    ToggleComponent,
    DifficultyLevelComponent,
    TagsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NgbTooltipModule,
    DynamicTranslatePipe,
    EscapeJavaForJsonPipe,
    FormsModule,
    EditorModule,
    CustomDatePipe
],
  exports: [
    ChallengeCardComponent,
    LoadingCardComponent,
    ResourceCardComponent,
    SolutionComponent,
    BreadcrumbComponent,
    DynamicTranslatePipe,
    EscapeJavaForJsonPipe,
    ToggleComponent,
    TagsComponent
  ]
})
export class SharedComponentsModule { }
