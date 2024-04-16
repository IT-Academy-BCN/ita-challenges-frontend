import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { TranslateLoader } from '@ngx-translate/core'
import { Observable, map } from 'rxjs'
import { Challenges } from 'src/app/models/challenges.interface'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-custom-loader',
  templateUrl: './custom-loader.html',
  styleUrl: './custom-loader.scss'
})
export class CustomLoader implements TranslateLoader {
  constructor (private readonly http: HttpClient) { }

  getTranslation (lang: string): Observable<any> {
    return this.http.get<Challenges>(environment.BACKEND_ITA_CHALLENGE_BASE_URL.concat(environment.BACKEND_ALL_CHALLENGES_URL)).pipe(
      map((res: Challenges) => {
        const langVersion: any[] = []

        res.forEach((challenge) => {
          let examples = ''

          challenge.detail.examples.forEach((example) => {
            examples += `"${example.idExample}": "${example.exampleText[lang]}",`
          })

          examples = JSON.parse(`{${examples.slice(0, (examples.length - 1))}}`)

          langVersion.push({
            challenge_title: challenge.challenge_title[lang],
            description: challenge.detail.description[lang],
            examples,
            note: challenge.detail.note !== null ? challenge.detail.note[lang] : null

          })
        })

        const challenges = { challenges: langVersion }

        const newJSONContent = { ...challenges, ...require(`../../../assets/i18n/${lang}.json`) }

        return newJSONContent
      }))
  }
}
