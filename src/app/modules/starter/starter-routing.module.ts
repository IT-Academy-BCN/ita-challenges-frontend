import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StarterComponent} from "./starter/starter.component";
import {ChallengeComponent} from "../../shared/components/challenge/challenge.component";

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StarterRoutingModule { }
