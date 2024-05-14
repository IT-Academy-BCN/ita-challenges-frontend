import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { environment } from 'src/environments/environment'
import { RelatedService } from './related.service'

describe('RelatedService', () => {
  let relatedService: RelatedService
  let httpClientMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({ // set up the testing module with required dependencies.
      imports: [HttpClientTestingModule],
      providers: [RelatedService]
    })

    httpClientMock = TestBed.inject(HttpTestingController)
    relatedService = TestBed.inject(RelatedService)
  })

  afterEach(() => {
    httpClientMock.verify()
  })

  it('should be created', () => {
    expect(relatedService).toBeTruthy()
  })

  it('should return related challenges response correctly', (done) => {
    const relatedId = 'f6e0f877-9560-4e68-bab6-7dd5f16b46a5'
    const responseMock = {
      id_challenge: 'f6e0f877-9560-4e68-bab6-7dd5f16b46a5',
      challenge_title: {
        es: 'Buscando los extremos',
        en: 'Searching for extremes',
        ca: 'Buscant els extrems'
      },
      level: 'EASY',
      creation_date: '1986-02-01',
      detail: {
        description: {
          es: 'En esta pequeña tarea, se te proporciona una cadena de números separados por espacios, y debes devolver el número más alto y el más bajo.',
          ca: "En aquesta petita tasca set donara una string de nombre separats per espais, hauras de retornar el major i menor d'aquests nombres.",
          en: 'In this little assignment you are given a string of space separated numbers, and have to return the highest and lowest number.'
        },
        examples: [
          {
            id_example: 'aef3ebe5-1a11-4b32-9f6e-98d27e2be22d',
            example_text: {
              es: 'Orden descendente',
              ca: 'Ordre descendent',
              en: 'Descending Order'
            }
          },
          {
            id_example: '8398539e-7b48-4a1e-9b8b-136f711c3dc9',
            example_text: {
              es: 'Orden descendente',
              ca: 'Ordre descendent',
              en: 'Descending Order'
            }
          },
          {
            id_example: '1e6af8d0-ccbf-4ebf-90ae-8e9b098a7a15',
            example_text: {
              es: 'Orden descendente',
              ca: 'Ordre descendent',
              en: 'Descending Order'
            }
          }
        ],
        note: null
      },
      languages: [
        {
          id_language: '660e1b18-0c0a-4262-a28a-85de9df6ac5f',
          language_name: 'Java'
        }
      ],
      solutions: [
        '0864463e-eb7c-4bb3-b8bc-766d71ab38b5'
      ],
      testingValues: [
        {
          in_param: [
            1,
            2,
            3,
            4,
            5
          ],
          out_param: [
            5,
            1
          ]
        },
        {
          in_param: [
            1,
            2,
            -3,
            4,
            5
          ],
          out_param: [
            5,
            -3
          ]
        },
        {
          in_param: [
            1,
            9,
            3,
            4,
            -5
          ],
          out_param: [
            9,
            -5
          ]
        }
      ]
    }

    relatedService.getRelatedChallenges(relatedId).subscribe(response => {
      expect(response).toEqual(responseMock)
      done()
    })

    const req = httpClientMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}/${relatedId}/related`)
    expect(req.request.method).toEqual('GET')

    req.flush(responseMock)
  })

  it('should return related challenges response error', (done) => {
    const relatedId = 'errorId'
    const errorMessage = 'Challenge with id errorId not found'
    const status = 500

    relatedService.getRelatedChallenges(relatedId).subscribe({
      error: err => {
        expect(err.status).toEqual(status)
        expect(err.error).toEqual(errorMessage)
        done()
      }
    })

    const req = httpClientMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}/${relatedId}/related`)
    expect(req.request.method).toEqual('GET')

    req.flush(errorMessage, { status, statusText: 'Internal Server Error' })
  })
})
