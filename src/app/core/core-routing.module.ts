import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from "./layout/main/main.component";
import { StarterComponent } from "../modules/starter/components/starter/starter.component";
import { ChallengeContainerComponent } from '../modules/challenge/components/challenge-container/challenge-container.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

const routes: Routes = [
    {
        path: 'ita-challenge',
        component: MainComponent,
        children: [
            {
                path: 'home',
                data: { breadcrumb: 'Inicio' },
                //provisional, must be changed for sth like "HomeComponent"
                component: BreadcrumbComponent
            },
            {
                path: 'challenges',
                data: { breadcrumb: 'Retos'},
                children:[
                    {
                        path: '',  
                        component: StarterComponent,
                        data: {breadcrumb: null}
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
