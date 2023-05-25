import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {ChallengeComponent} from "../../shared/components/challenge/challenge.component";
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
