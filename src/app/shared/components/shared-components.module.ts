import { NgModule } from '@angular/core';
import {ChallengeComponent} from "../../shared/components/challenge/challenge.component";
import { RouterModule } from '@angular/router';


@NgModule({
    declarations: [
        ChallengeComponent
    ],
    imports: [
        RouterModule
    ],
    exports: [
        ChallengeComponent
    ]
})
export class SharedComponentsModule { }
