import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';
import { Challenges } from 'src/app/models/challenges.interface';

@Component({
  selector: 'app-custom-loader',
  templateUrl: './custom-loader.html',
  styleUrl: './custom-loader.scss'
})
export class CustomLoader implements TranslateLoader {

  constructor(private http: HttpClient) { }

  getTranslation(lang: string): Observable<any> {

    return this.http.get<Challenges>(`../../../assets/dummy/challenge-out.json`).pipe(
      map((res: Challenges) => {
        let langVersion: any[] = [];
        let langUpperCase = lang.toUpperCase();

        res.forEach((challenge) => {
          let examples = "";

          challenge.detail.examples.forEach((example) => {
            examples += `"${example._id.$uuid}": "${example.example_text[langUpperCase]}",`
          })

          examples = JSON.parse(`{${examples.slice(0, (examples.length - 1))}}`)

          langVersion.push({
            "challenge_title": challenge.challenge_title[langUpperCase],
            "description": challenge.detail.description[langUpperCase],
            examples,
            "notes": challenge.detail.notes[langUpperCase]

          });
        })

        let challenges = { "challenges": langVersion };

        let newJSONContent = { ...challenges, ...require(`../../../assets/i18n/${lang}.json`) }

        return newJSONContent;
      }))
  }

}

