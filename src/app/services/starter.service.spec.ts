import { StarterService } from './starter.service'
import { TestScheduler } from 'rxjs/internal/testing/TestScheduler'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { delay } from 'rxjs'
import data from './../../assets/dummy/data-challenge.json'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { TestBed } from '@angular/core/testing'
import { type Challenge } from '../models/challenge.model'

describe('StarterService', () => {
  let service: StarterService
  // let httpClientSpy: any;
  let testScheduler: TestScheduler
  let httpClient: HttpClient
  let httpClientMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
    httpClient = TestBed.inject(HttpClient)
    httpClientMock = TestBed.inject(HttpTestingController)
    service = new StarterService(httpClient)
    testScheduler = new TestScheduler((actual, expected) => {
    })
  })

  it('Should stream all challenges', (done) => {
    const mockResponse: Record<string, unknown> = { challenge: 'challenge' }
    service.getAllChallenges().subscribe()
    const req = httpClientMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`)
    expect(req.request.method).toEqual('GET')
    req.flush(mockResponse)
    done()
  })

  it('should make GET request with correct parameters', () => {
    const mockResponse = { challenge: 'challenge' }
    const pageOffset = 0
    const pageLimit = 8

    service.getAllChallengesOffset(pageOffset, pageLimit).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpClientMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}?offset=${pageOffset}&limit=${pageLimit}`)
    expect(req.request.method).toEqual('GET')
    req.flush(mockResponse)
  })

  it('should sort challenges by creation date in asscending order', () => {
    const mockChallenges: Challenge[] = [
      {
        id_challenge: '1',
        challenge_title: 'Challenge 1',
        level: 'EASY',
        popularity: 1,
        creation_date: new Date('2022-05-10'),
        detail: {
          description: 'lorem',
          examples: [],
          notes: 'lorem'
        },
        languages: [
          {
            id_language: '1',
            language_name: 'lorem'
          }
        ],
        solutions: [
          {
            idSolution: '1',
            solutionText: 'Aquí va el texto de la solución 1'
          }
        ]
      },
      {
        id_challenge: '2',
        challenge_title: 'Challenge 2',
        level: 'EASY',
        popularity: 1,
        creation_date: new Date('2022-05-10'),
        detail: {
          description: 'lorem',
          examples: [],
          notes: 'lorem'
        },
        languages: [
          {
            id_language: '2',
            language_name: 'lorem'
          }
        ],
        solutions: [
          {
            idSolution: '1',
            solutionText: 'Aquí va el texto de la solución 1'
          }
        ]
      },
      {
        id_challenge: '3',
        challenge_title: 'Challenge 1',
        level: 'EASY',
        popularity: 1,
        creation_date: new Date('2022-05-10'),
        detail: {
          description: 'lorem',
          examples: [],
          notes: 'lorem'
        },
        languages: [
          {
            id_language: '1',
            language_name: 'lorem'
          }
        ],
        solutions: [
          {
            idSolution: '1',
            solutionText: 'Aquí va el texto de la solución 1'
          }
        ]
      }
    ]

    const offset = 0
    const limit = 3

    const sortedChallengesObservable = service.orderBySortAscending('creation_date', mockChallenges, offset, limit)

    sortedChallengesObservable.subscribe((sortedChallenges: any) => {
      expect(sortedChallenges[0].creation_date).toBe('2022-05-08')
      expect(sortedChallenges[1].creation_date).toBe('2022-05-09')
      expect(sortedChallenges[2].creation_date).toBe('2022-05-10')
    })
  })

  it('should sort challenges by creation date in descending order', () => {
    const mockChallenges: Challenge[] = [
      {
        id_challenge: '1',
        challenge_title: 'Challenge 1',
        level: 'EASY',
        popularity: 1,
        creation_date: new Date('2022-05-10'),
        detail: {
          description: 'lorem',
          examples: [],
          notes: 'lorem'
        },
        languages: [
          {
            id_language: '1',
            language_name: 'lorem'
          }
        ],
        solutions: [
          {
            idSolution: '1',
            solutionText: 'Aquí va el texto de la solución 1'
          }
        ]
      },
      {
        id_challenge: '2',
        challenge_title: 'Challenge 2',
        level: 'EASY',
        popularity: 1,
        creation_date: new Date('2022-05-10'),
        detail: {
          description: 'lorem',
          examples: [],
          notes: 'lorem'
        },
        languages: [
          {
            id_language: '2',
            language_name: 'lorem'
          }
        ],
        solutions: [
          {
            idSolution: '1',
            solutionText: 'Aquí va el texto de la solución 1'
          }
        ]
      },
      {
        id_challenge: '3',
        challenge_title: 'Challenge 1',
        level: 'EASY',
        popularity: 1,
        creation_date: new Date('2022-05-10'),
        detail: {
          description: 'lorem',
          examples: [],
          notes: 'lorem'
        },
        languages: [
          {
            id_language: '1',
            language_name: 'lorem'
          }
        ],
        solutions: [
          {
            idSolution: '1',
            solutionText: 'Aquí va el texto de la solución 1'
          }
        ]
      }
    ]
    const offset = 0
    const limit = 3

    const sortedChallengesObservable = service.orderBySortAsDescending('creation_date', mockChallenges, offset, limit)

    sortedChallengesObservable.subscribe((sortedChallenges: any) => {
      expect(sortedChallenges[2].creation_date).toBe('2022-05-10')
      expect(sortedChallenges[1].creation_date).toBe('2022-05-09')
      expect(sortedChallenges[0].creation_date).toBe('2022-05-08')
    })
  })

  it('Should stream all challenges', () => {
    testScheduler.run(({ expectObservable }) => {
      const expectedMarble = '---(a|)'
      const expectedValues = { a: data }
      const obs$ = service.getAllChallenges().pipe(delay(3))

      expectObservable(obs$).toBe(expectedMarble, expectedValues)
    })
  })

  it('should filter challenges correctly', () => {
    const mockFilters = {
      languages: [],
      levels: ['EASY'],
      progress: []
    }
    const mockChallenges: Challenge[] = []
    service.getAllChallengesFiltered(mockFilters, mockChallenges).subscribe(filteredChallenges => {
      expect(filteredChallenges.length).toBe(1)
      expect(filteredChallenges[0].id).toBe(1)
    })
  })
})
