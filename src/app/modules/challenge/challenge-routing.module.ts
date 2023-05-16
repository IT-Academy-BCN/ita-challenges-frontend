import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChallengeComponent} from "../../shared/components/challenge/challenge.component";
import { StarterComponent } from '../starter/starter/starter.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChallengeRoutingModule { }
