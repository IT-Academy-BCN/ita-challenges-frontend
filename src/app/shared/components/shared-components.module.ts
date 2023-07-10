import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ChallengeComponent } from "../../shared/components/challenge/challenge.component";
import { ResourceComponent } from './resource/resource.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';


@NgModule({
    declarations: [
        ChallengeComponent,
        ResourceComponent,
        BreadcrumbComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgbTooltipModule
    ],
    exports: [
        ChallengeComponent,
        ResourceComponent,
        BreadcrumbComponent
    ],  
})
export class SharedComponentsModule { }
