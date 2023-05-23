import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {ChallengeComponent} from "../../shared/components/challenge/challenge.component";

@NgModule({
    declarations: [
        ChallengeComponent
    ],
    imports: [RouterModule],
    exports: [
        ChallengeComponent
    ]
})
export class SharedComponentsModule { }
