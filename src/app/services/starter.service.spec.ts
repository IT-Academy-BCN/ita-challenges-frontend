import { StarterService } from './starter.service'
import { TestScheduler } from 'rxjs/internal/testing/TestScheduler'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { delay } from 'rxjs'
import data from './../../assets/dummy/data-challenge.json' // see data-typings.d.ts
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { TestBed } from '@angular/core/testing'
import { type Challenge } from '../models/challenge.model'
import mockChallenges from '../../../src/mocks/challenge/challenge.mock.json'

/* Observable Test, see https://docs.angular.lat/guide/testing-components-scenarios */
describe('StarterService', () => {
  it('should emit on refresh$ and clear cache when invalidateCacheAndRefresh is called', (done) => {
    const http = TestBed.inject(HttpClient)
    const service = new StarterService(http)
    // seed cache
    ;(service as any).cachedChallenges = { count: 0, limit: 0, offset: 0, results: [] } as any

    expect(service.cachedChallenges).not.toBeNull()

    service.refresh$.subscribe(() => {
      expect(service.cachedChallenges).toBeNull()
      done()
    })

    service.invalidateCacheAndRefresh()
  })
  let service: StarterService
  // let httpClientSpy: any;
  let testScheduler: TestScheduler
  let httpClient: HttpClient
  let httpClientMock: HttpTestingController
  let parsedChallenges: Challenge[]

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    httpClient = TestBed.inject(HttpClient)
    httpClientMock = TestBed.inject(HttpTestingController)
    service = new StarterService(httpClient)
    testScheduler = new TestScheduler(() => {})

    parsedChallenges = mockChallenges.map(challenge => ({
      ...challenge,
      creation_date: new Date(challenge.creation_date),
      solutions: challenge.solutions.map(solution => ({
        id_solution: solution.idSolution,
        solution_text: solution.solutionText
      })),
      favorites_count: 0,
      saved_count: 0,
      timesFavorite: 0,
      timesSolved: 0,
      bookmarked: false
    })) as unknown as Challenge[];
  })

  afterEach(() => { // 🟢 verificar no queden requests pendientes
    httpClientMock.verify();
  });

  describe('orderBySort', () => {
    it('should sort challenges by creation_date ascending', (done) => {
      service.orderBySort('creation_date', parsedChallenges, 0, 3, true).subscribe(result => {
        expect(result[0].id_challenge).toBe('1')
        expect(result[1].id_challenge).toBe('3')
        expect(result[2].id_challenge).toBe('2')
        done()
      })
    })

    it('should sort challenges by creation_date descending', (done) => {
      service.orderBySort('creation_date', parsedChallenges, 0, 3, false).subscribe(result => {
        expect(result[0].id_challenge).toBe('2')
        expect(result[1].id_challenge).toBe('3')
        expect(result[2].id_challenge).toBe('1')
        done()
      })
    })

    it('should sort challenges by popularity ascending', (done) => {
      parsedChallenges[0].timesSolved = 10
      parsedChallenges[1].timesSolved = 20
      parsedChallenges[2].timesSolved = 30

      service.orderBySort('popularity', parsedChallenges, 0, 3, true).subscribe(result => {
        expect(result[0].timesSolved).toBe(10)
        expect(result[1].timesSolved).toBe(20)
        expect(result[2].timesSolved).toBe(30)
        done()
      })
    })

    it('should sort challenges by popularity descending', (done) => {
      parsedChallenges[0].timesSolved = 10
      parsedChallenges[1].timesSolved = 20
      parsedChallenges[2].timesSolved = 30

      service.orderBySort('popularity', parsedChallenges, 0, 3, false).subscribe(result => {
        expect(result[0].timesSolved).toBe(30)
        expect(result[1].timesSolved).toBe(20)
        expect(result[2].timesSolved).toBe(10)
        done()
      })
    })

    it('should sort challenges by likes (timesFavorite)', (done) => {
      parsedChallenges[0].timesFavorite = 10
      parsedChallenges[1].timesFavorite = 5
      parsedChallenges[2].timesFavorite = 20

      service.orderBySort('likes', parsedChallenges, 0, 3, true).subscribe(result => {
        expect(result[0].timesFavorite).toBe(5)
        expect(result[1].timesFavorite).toBe(10)
        expect(result[2].timesFavorite).toBe(20)

        service.orderBySort('likes', parsedChallenges, 0, 3, false).subscribe(resDesc => {
          expect(resDesc[0].timesFavorite).toBe(20)
          expect(resDesc[1].timesFavorite).toBe(10)
          expect(resDesc[2].timesFavorite).toBe(5)
          done()
        })
      })
    })

    it('should sort challenges by difficulty (level)', (done) => {
      parsedChallenges[0].level = 'HARD'
      parsedChallenges[1].level = 'EASY'
      parsedChallenges[2].level = 'MEDIUM'

      service.orderBySort('difficulty', parsedChallenges, 0, 3, true).subscribe(result => {
        expect(result[0].level).toBe('EASY')
        expect(result[1].level).toBe('MEDIUM')
        expect(result[2].level).toBe('HARD')

        service.orderBySort('difficulty', parsedChallenges, 0, 3, false).subscribe(resDesc => {
          expect(resDesc[0].level).toBe('HARD')
          expect(resDesc[1].level).toBe('MEDIUM')
          expect(resDesc[2].level).toBe('EASY')
          done()
        })
      })
    })
  })
  it('Should stream all challenges', (done) => {
    const mockResponse: Record<string, unknown> = { challenge: 'challenge' }
    service.getAllChallenges().subscribe()
    const req = httpClientMock.expectOne(
      `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`
    )
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

    const req = httpClientMock.expectOne(
      `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}?offset=${pageOffset}&limit=${pageLimit}`
    )
    expect(req.request.method).toEqual('GET')
    req.flush(mockResponse)
  })

  it('Should stream all challenges (RxJS marble test)', () => { // 🟢 nombre diferenciado
    testScheduler.run(({ expectObservable }) => {
      const expectedMarble = '---(a|)';
      const expectedValues = { a: data as any };

      (service as any).cachedChallenges = data as any; // 🟢 forzamos cache para no depender de HTTP
      const obs$ = service.getAllChallenges().pipe(delay(3));

      expectObservable(obs$).toBe(expectedMarble, expectedValues);
    });
  });

  it('should filter challenges correctly', () => {
    const mockFilters = {
      languages: [], // Suponiendo que 1 y 2 son IDs de lenguaje válidos
      levels: ['EASY'],
      progress: []
    }

    const mockChallengesMinimal: Challenge[] = [
      ({ id_challenge: '1', level: 'EASY' } as unknown) as Challenge,
      ({ id_challenge: '2', level: 'MEDIUM' } as unknown) as Challenge
    ];

    service.getAllChallengesFiltered(mockFilters as any, mockChallengesMinimal).subscribe(filteredChallenges => {
      expect(filteredChallenges.length).toBe(1)
      expect(filteredChallenges[0].id_challenge).toBe('1')
    })
  })

  it('should filter by language id', (done) => {
    const fake: any[] = [
      { id_challenge: 'a', level: 'EASY', languages: [{ id_language: 'lang-js' }] },
      { id_challenge: 'b', level: 'EASY', languages: [{ id_language: 'lang-java' }] },
    ];
    const filters: any = { languages: ['lang-js'], levels: [], progress: [] };

    service.getAllChallengesFiltered(filters, fake as any).subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].id_challenge).toBe('a');
      done();
    });
  });

  it('should propagate error on getAllChallengesOffset HTTP failure', (done) => {
    const offset = 0, limit = 8;
    const sub = service.getAllChallengesOffset(offset, limit).subscribe({
      next: () => fail('should not emit next on error'),
      error: (e) => { expect(e.status).toBe(500); done(); }
    });

    const req = httpClientMock.expectOne(
      `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}?offset=${offset}&limit=${limit}`
    );
    req.flush({ message: 'boom' }, { status: 500, statusText: 'Server Error' });
  });

})
