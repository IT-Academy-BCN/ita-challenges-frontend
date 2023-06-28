import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {ChallengeComponent} from "./challenge/challenge.component";
import { CommonModule } from '@angular/common';
import { ResourceComponent } from './resource/resource.component';


@NgModule({
    declarations: [
        ChallengeComponent,
        ResourceComponent
    ],
    imports: [
        CommonModule,
        RouterModule],
    exports: [
        ChallengeComponent,
        ResourceComponent
    ],  
})
export class SharedComponentsModule { }
