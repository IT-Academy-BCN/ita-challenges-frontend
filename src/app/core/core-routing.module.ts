import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from "./layout/main/main.component";
import { StarterComponent } from "../modules/starter/components/starter/starter.component";
import { ChallengeComponent } from '../modules/challenge/components/challenge/challenge.component';
import { ProfileComponent } from '../modules/profile/components/profile/profile.component';

const routes: Routes = [
    {
        path: 'ita-challenge',
        component: MainComponent,
        children: [
            {
                path: 'challenges',
                children:[
                    {
                        path: '',  
                        component: StarterComponent,
                    },
                    {
                        path: ':idChallenge', 
                        component: ChallengeComponent, 
                    },
                ]
            },
            {
                path: 'profile',
                component: ProfileComponent,
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoreRoutingModule { }
