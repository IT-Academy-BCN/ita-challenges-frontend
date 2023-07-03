import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ChallengeComponent } from "../../shared/components/challenge/challenge.component";
import { ResourceComponent } from './resource/resource.component';
import { SolutionComponent } from './solution/solution.component';


@NgModule({
    declarations: [
        ChallengeComponent,
        ResourceComponent,
        SolutionComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgbTooltipModule
    ],
    exports: [
        ChallengeComponent,
        ResourceComponent,
        SolutionComponent
    ],  
})
export class SharedComponentsModule { }
