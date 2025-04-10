import { NgModule } from '@angular/core'
import { type Routes, RouterModule } from '@angular/router'
import { EditChallengeComponent } from './components/edit-challenge/edit-challenge.component'

const routes: Routes = [
  {
    path: ':idChallenge/edit',
    component: EditChallengeComponent
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChallengeRoutingModule { }
