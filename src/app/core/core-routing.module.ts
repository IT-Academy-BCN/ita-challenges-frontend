import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from "./layout/main/main.component";
import { StarterComponent } from "../modules/starter/components/starter/starter.component";
import { ChallengeComponent } from '../modules/challenge/components/challenge/challenge.component';
import { BreadcrumbComponent } from '../shared/components/breadcrumb/breadcrumb.component';

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
                        data: { breadcrumb: null}
                    },
                    {
                        path: ':idChallenge', 
                        component: ChallengeComponent, 
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
