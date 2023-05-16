import { NgModule } from '@angular/core';
import {ChallengeComponent} from "../../shared/components/challenge/challenge.component";
import { RouterModule } from '@angular/router';
import { ResourceComponent } from './resource/resource.component';

@NgModule({
    declarations: [
        ChallengeComponent,
        ResourceComponent
    ],
    imports: [RouterModule],
    exports: [
        ChallengeComponent,
        ResourceComponent
    ]
})
export class SharedComponentsModule { }
