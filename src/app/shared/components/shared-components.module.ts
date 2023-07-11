import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ChallengeCardComponent } from "./challenge-card/challenge-card.component";
import { ResourceCardComponent } from './resource-card/resource-card.component';
import { SolutionComponent } from './solution/solution.component';


@NgModule({
    declarations: [
        ChallengeCardComponent,
        ResourceCardComponent,
        SolutionComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgbTooltipModule
    ],
    exports: [
        ChallengeCardComponent,
        ResourceCardComponent,
        SolutionComponent
    ],  
})
export class SharedComponentsModule { }
