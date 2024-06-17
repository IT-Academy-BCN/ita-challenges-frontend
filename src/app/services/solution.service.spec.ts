import { TestBed, inject } from '@angular/core/testing'
import { SolutionService } from './solution.service'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { DataSolution } from '../models/data-solution.model'
import { environment } from 'src/environments/environment'

describe('Service: SendSolution', () => {

  let solutionService: SolutionService
  let httpClient: HttpClient
  let httpClientMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [SolutionService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })

    httpClient = TestBed.inject(HttpClient) // TestBed.inject is used to inject into the test suite
    httpClientMock = TestBed.inject(HttpTestingController)
    solutionService = TestBed.inject(SolutionService)
  })

  it('should ...', inject([SolutionService], (service: SolutionService) => {
    expect(service).toBeTruthy()
  }))

  it('should get all solutions succesfully', (done) => {
    const mockData: DataSolution[] = [
      {

        "offset": 0,
        "limit": 2,
        "count": 2,
        "results": [
            {
                "id_solution": "1682b3e9-056a-45b7-a0e9-eaf1e11775ad",
                "solution_text": "Sed dictum. Proin eget odio. Aliquam vulputate ullamcorper magna. Sed eu eros. Nam consequat dolor vitae dolor. Donec fringilla. Donec",
                "uuid_language": "409c9fe8-74de-4db3-81a1-a55280cf92ef",
                "uuid_challenge": null // A dia de hoy, el endpoint devuelve null para este valor, habrá que cambiarlo aqui y en data-solution.model cuando se arregle
            },
            {
                "id_solution": "a7a789a9-2006-4b59-94bb-3afe0d1c161d",
                "solution_text": "Sed dictum. Proin eget odio. Aliquam vulputate ullamcorper magna. Sed eu eros. Nam consequat dolor vitae dolor. Donec fringilla. Donec",
                "uuid_language": "409c9fe8-74de-4db3-81a1-a55280cf92ef",
                "uuid_challenge": null
            }
        ]      }
    ]
    const idChallenge = 'dcacb291-b4aa-4029-8e9b-284c8ca80296'
    const idLanguage = '409c9fe8-74de-4db3-81a1-a55280cf92ef'

    httpClient.get<DataSolution>(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_SOLUTION}/${idChallenge}/language/${idLanguage}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).subscribe((res) => {
      expect(res).toEqual(mockData)
      done()
    })

    const req = httpClientMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_SOLUTION}/${idChallenge}/language/${idLanguage}`)
    expect(req.request.method).toEqual('GET')
    req.flush(mockData)
  })


})
