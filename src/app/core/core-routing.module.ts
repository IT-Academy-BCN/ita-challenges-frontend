import { NgModule } from '@angular/core'
import { type Routes, RouterModule } from '@angular/router'
import { MainComponent } from './layout/main/main.component'
import { StarterComponent } from '../modules/starter/components/starter/starter.component'
import { ChallengeComponent } from '../modules/challenge/components/challenge/challenge.component'
import { ProfileComponent } from '../modules/profile/components/profile/profile.component'
import { StarChallengeComponent } from '../modules/challenge/components/star-challenge/star-challenge.component'

const routes: Routes = [
  {
    path: 'ita-challenge',
    component: MainComponent,
    children: [
      {
        path: 'challenges',
        children: [
          // {
          //   path: 'challenges/:idChallenge/start', component: StarChallengeComponent
          // },
          {
            path: 'create',
            loadComponent: async () =>
              (await import('../modules/challenge/components/challenge-form/challenge-form.component')).ChallengeFormComponent
          },
          {
            path: '',
            component: StarterComponent
          },
          {
            path: ':idChallenge',
            component: ChallengeComponent
          }
        ]
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'mentor',
        loadComponent: async () =>
          (await import('../modules/mentor/mentor-login/mentor-login.component')).MentorLoginComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
