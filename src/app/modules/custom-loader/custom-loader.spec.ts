import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { CustomLoader } from './custom-loader'
import { TestBed } from '@angular/core/testing'
import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'

describe('CustomLoader', () => {
  let httpClientMock: HttpTestingController
  let customLoader: CustomLoader

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
      // providers: [CustomLoader]
    })
    httpClientMock = TestBed.inject(HttpTestingController)
    // customLoader = TestBed.inject(CustomLoader)
    customLoader = new CustomLoader(TestBed.inject(HttpClient))
  })

  it('should create custom-loader correctly', (done) => {
    expect(customLoader).toBeTruthy()
    done()
  })

  it('should return translation file with challenges', (done) => {
    const mockLang: string = 'es'
    const expectedResponse = {
      challenges: [
        {
          challenge_title: 'Titulo en español',
          examples: {
            example_id: 'Ejemplo en español'
          },
          description: 'Descripción en español',
          note: 'Nota en español'
        }
      ]
    }

    const mockResponse =
            [
              {
                id_challenge: '2bfc1a9e-30e3-40b2-9e97-8db7c5a4e9e4',
                challenge_title: {
                  es: 'Titulo en español',
                  cat: 'Títol en català',
                  en: 'Title in english'
                },
                level: 'mockLevel',
                creation_date: '2018-09-09',
                detail: {
                  description: {
                    es: 'Descripción en español',
                    cat: 'Descripció en català',
                    en: 'Description in english.'
                  },
                  examples: [
                    {
                      idExample: 'example_id',
                      exampleText: {
                        es: 'Ejemplo en español',
                        cat: 'Exemple en català',
                        en: 'Example in english'
                      }
                    }
                  ],
                  note: {
                    es: 'Nota en español',
                    cat: 'Nota en català',
                    en: 'Note in english'
                  }
                },
                languages: [
                  {
                    id_language: 'mock Language Id',
                    language_name: 'mock Language Name'
                  }
                ],
                solutions: [
                  'mock solution'
                ]
              }
            ]

    let fileWithTranslation: any

    customLoader.getTranslation(mockLang)
      .subscribe({
        next: (res) => {
          expect(res).toBeTruthy()
          fileWithTranslation = res
          console.log(res)
        }
      })

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_CHALLENGE_BASE_URL.concat(environment.BACKEND_ALL_CHALLENGES_URL))
    expect(req.request.method).toEqual('GET')
    req.flush(mockResponse)

    expect(fileWithTranslation).toEqual({ ...expectedResponse, ...require('../../../assets/i18n/es.json') })
    done()
  })
})
