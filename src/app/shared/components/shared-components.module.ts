import { NgModule } from '@angular/core';
import {ChallengeComponent} from "../../shared/components/challenge/challenge.component";
import { ChallengeService } from 'src/app/services/challenge.service';
import { CommonModule } from '@angular/common';
import { StarterService } from 'src/app/services/starter.service';

@NgModule({
    declarations: [
        ChallengeComponent
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        ChallengeComponent
    ],  
    providers: [
        StarterService,
        ChallengeService
      ]
})
export class SharedComponentsModule { }
