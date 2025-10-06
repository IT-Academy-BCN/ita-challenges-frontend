import { NgModule } from '@angular/core'
import { type Routes, RouterModule } from '@angular/router'
import { MainComponent } from './layout/main/main.component'
import { StarterComponent } from '../modules/starter/components/starter/starter.component'
import { ChallengeComponent } from '../modules/challenge/components/challenge/challenge.component'
import { ProfileComponent } from '../modules/profile/components/profile/profile.component'
import { BookmarkComponent } from '../modules/bookmark/components/bookmark/bookmark.component'

const routes: Routes = [
  {
    path: 'ita-challenge',
    component: MainComponent,
    children: [
      {
        path: 'challenges',
        children: [
          {
            path: 'new-challenge',
            loadComponent: async () =>
              (await import('../modules/challenge/components/challenge-form/challenge-form.component')).ChallengeFormComponent
          },
          {
            path: 'edit/:id',
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
          },
          {
            path: ':idChallenge/start',
            component: ChallengeComponent
          }
        ]
      },
      {
        path: 'profile',
        component: ProfileComponent
      }, 
      {
        path: 'bookmark',
        component: BookmarkComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
