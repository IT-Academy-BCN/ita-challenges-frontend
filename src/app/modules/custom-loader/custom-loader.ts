import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-custom-loader',
  templateUrl: './custom-loader.html',
  styleUrl: './custom-loader.scss'
})
export class CustomLoader implements TranslateLoader {

  constructor(private http: HttpClient) { }

  getTranslation(lang: string): Observable<any> {

    return this.http.get(`../../../assets/i18n/${lang}.json`).pipe(
      map((res: any) => {
        let langs: string[] = ['cat', 'en', 'es']
        let resp: any = {
          challenges:
          {
            "_id": {
              "$uuid": "dcacb291-b4aa-4029-8e9b-284c8ca80296"
            },
            "challenge_title": {
              "ES": "Titulo en español",
              "CAT": "Títol en català",
              "EN": "Descending Order"
            },
          }
        };

        let langUpperCase = lang.toUpperCase()
        let file = resp.challenges.challenge_title[langUpperCase];

        let translation: string = 
        ` {
          challenges:
            {
              "_id": {
                "$uuid": "dcacb291-b4aa-4029-8e9b-284c8ca80296"
              },
              "challenge_title": "${resp.challenges.challenge_title[langUpperCase]}"
            },
        }`

        let translationJSON = JSON.parse(translation);
        console.log(translationJSON)

        let newJSONContent = { ...translationJSON, ...require(`../../../assets/i18n/${lang}.json`) }

        return newJSONContent;
      }))
  }
  // const targetPath = '../../../../../assets/i18n/es.json'
  // tar.writeFile(targetPath, newJSONContent, () => {
  //   console.log(`Successfully generated environment.development.ts`);
  // });
  // let challengesValues = Object.values(challenges);
  // console.log(challengesValues[0])
  // console.log(challengesValues)

}

