import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { ChallengeComponent } from "../../shared/components/challenge/challenge.component";
import { ResourceComponent } from './resource/resource.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
    declarations: [
        ChallengeComponent,
        ResourceComponent,
        PaginationComponent
=======
import { ChallengeCardComponent } from "./challenge-card/challenge-card.component";
import { ResourceCardComponent } from './resource-card/resource-card.component';


@NgModule({
    declarations: [
        ChallengeCardComponent,
        ResourceCardComponent
>>>>>>> c5c397e8b26e47de4a5b19212834e46a70498d1a
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgbTooltipModule
    ],
    exports: [
<<<<<<< HEAD
        ChallengeComponent,
        ResourceComponent,
        PaginationComponent
=======
        ChallengeCardComponent,
        ResourceCardComponent
>>>>>>> c5c397e8b26e47de4a5b19212834e46a70498d1a
    ],  
})
export class SharedComponentsModule { }
