import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from "../../core/layout/main/main.component";

const routes: Routes = [
    { path: 'ita-challenge', component: MainComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StarterRoutingModule { }
