import { NgModule } from '@angular/core';
import {ChallengeComponent} from "../../shared/components/challenge/challenge.component";
import { ResourceComponent } from './resource/resource.component';


@NgModule({
    declarations: [
        ChallengeComponent,
        ResourceComponent
    ],
    imports: [],
    exports: [
        ChallengeComponent,
        ResourceComponent
    ]
})
export class SharedComponentsModule { }
