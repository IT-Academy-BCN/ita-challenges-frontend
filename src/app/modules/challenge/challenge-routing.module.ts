import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChallengeComponent} from "./challenge/challenge.component";

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChallengeRoutingModule { }
