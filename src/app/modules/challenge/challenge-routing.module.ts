import { NgModule } from '@angular/core'
import { type Routes, RouterModule } from '@angular/router'

const routes: Routes = [
  // { path: 'ita-challenge/challenges/:idChallenge/start', component: StarChallengeComponent }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChallengeRoutingModule { }
