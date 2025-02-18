import { NgModule } from '@angular/core'
import { type Routes, RouterModule } from '@angular/router'
import { StartChallengeComponent } from '../challenge/components/start-challenge/start-challenge.component'

const routes: Routes = [
  { path: 'ita-challenge/challenges/:idChallenge/start', component: StartChallengeComponent }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChallengeRoutingModule { }
