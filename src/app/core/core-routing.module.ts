import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from "./layout/main/main.component";
import { StarterComponent } from "../modules/starter/components/starter/starter.component";
import { ChallengeContainerComponent } from '../modules/challenge/components/challenge-container/challenge-container.component';

const routes: Routes = [
    {
        path: 'ita-challenge',
        component: MainComponent,
        children: [
            {
                path: 'challenges',
                data: { breadcrumb: 'Retos'},
                children:[
                    {
                        path: '',  
                        component: StarterComponent,
                    },
                    {
                        path: ':idChallenge', 
                        component: ChallengeContainerComponent,
                        data: { breadcrumb: 'Reto'}
                    },
                ]
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoreRoutingModule { }
