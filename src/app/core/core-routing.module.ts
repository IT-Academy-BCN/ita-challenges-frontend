import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from "./layout/main/main.component";
import {StarterComponent} from "../modules/starter/starter/starter.component";
import {StarterRoutingModule} from "../modules/starter/starter-routing.module";
import {ChallengeComponent} from "../shared/components/challenge/challenge.component";
import { ChallengeContainerComponent } from '../modules/challenge/challenge-container/challenge-container.component';

const routes: Routes = [
    {
        path: 'ita-challenge',
        component: MainComponent,
        children: [
            {
                path: 'challenge-list',
                component: StarterComponent
            },
            {
                path: 'challenge/:idChallenge',
                //component: ChallengeComponent
                component: ChallengeContainerComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoreRoutingModule { }
