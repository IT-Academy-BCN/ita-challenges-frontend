import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ChallengeComponent } from "../../shared/components/challenge/challenge.component";
import { ResourceComponent } from './resource/resource.component';
import { SolutionsLoggedButtonComponent } from './solutions-logged-button/solutions-logged-button.component';
import { SolutionsUnloggedButtonComponent } from './solutions-unlogged-button/solutions-unlogged-button.component';


@NgModule({
    declarations: [
        ChallengeComponent,
        ResourceComponent,
        SolutionsLoggedButtonComponent,
        SolutionsUnloggedButtonComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgbTooltipModule
    ],
    exports: [
        ChallengeComponent,
        ResourceComponent,
        SolutionsLoggedButtonComponent,
        SolutionsUnloggedButtonComponent
    ],  
})
export class SharedComponentsModule { }
