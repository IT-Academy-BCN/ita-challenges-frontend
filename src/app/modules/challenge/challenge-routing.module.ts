import { NgModule } from '@angular/core'
import { type Routes, RouterModule } from '@angular/router'
import { ChallengeInfoComponent } from './components/challenge-info/challenge-info.component'

const routes: Routes = [
  { path: 'ita-challenge/challenges/:id', component: ChallengeInfoComponent }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChallengeRoutingModule { }
