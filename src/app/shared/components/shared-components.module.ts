import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ChallengeComponent } from "../../shared/components/challenge/challenge.component";
import { ResourceComponent } from './resource/resource.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
    declarations: [
        ChallengeComponent,
        ResourceComponent,
        PaginationComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgbTooltipModule
    ],
    exports: [
        ChallengeComponent,
        ResourceComponent,
        PaginationComponent
    ],  
})
export class SharedComponentsModule { }
