import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ChallengeCardComponent } from "./challenge-card/challenge-card.component";
import { ResourceCardComponent } from './resource-card/resource-card.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';


@NgModule({
    declarations: [
        ChallengeCardComponent,
        ResourceCardComponent,
        BreadcrumbComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgbTooltipModule
    ],
    exports: [
        ChallengeCardComponent,
        ResourceCardComponent,
        BreadcrumbComponent
    ],  
})
export class SharedComponentsModule { }
