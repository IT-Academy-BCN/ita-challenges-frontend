import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ChallengeComponent } from "../../shared/components/challenge/challenge.component";
import { ResourceComponent } from './resource/resource.component';


@NgModule({
    declarations: [
        ChallengeComponent,
        ResourceComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgbTooltipModule
    ],
    exports: [
        ChallengeComponent,
        ResourceComponent
    ],  
})
export class SharedComponentsModule { }
