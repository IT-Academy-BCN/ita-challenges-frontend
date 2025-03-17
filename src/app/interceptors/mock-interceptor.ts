import { Injectable } from '@angular/core'
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { map, tap } from 'rxjs/operators'

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(req.url.includes('/related')){

      return of(new HttpResponse({
        body: {
          "count": 1,
          "offset": 0,
          "limit": 10,
          "results": [
            {
              "id_challenge": "2f948de0-6f0c-4089-90b9-7f70a0812319",
              "challenge_title": {
                "ES": "Filtrado de Listas",
                "CA": "Filtratge de Llistes",
                "EN": "List Filtering"
              },
              "languages": [
                {
                    "id_language": "660e1b18-0c0a-4262-a28a-85de9df6ac5f",
                    "language_name": "Java",
                    "language_image": "https://default-image.com/default.png"
                }
              ],
              "level": "EASY",
              "creation_date": "2004-09-07",
              "related": []
            }
          ]
        }
      }));
    }
  return next.handle(req);
  }
}

