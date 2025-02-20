import { NgModule } from '@angular/core'
import { type Routes, RouterModule } from '@angular/router'
import { ChallengeComponent } from './components/challenge/challenge.component'

const routes: Routes = [
  // { path: 'ita-challenge/challenges/:idChallenge/start', component: ChallengeComponent },
  { path: 'ita-challenge/challenges//start', component: ChallengeComponent }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChallengeRoutingModule { }
