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

  it('should sort challenges by creation_date and popularity', (done) => {
    // Test para creation_date
    const sortByDate = 'creation_date'
    const isAscendingDate = true
    const offset = 0
    const limit = 3
    service.orderBySort(sortByDate, parsedChallenges, offset, limit, isAscendingDate).subscribe(result => {
      expect(result.length).toBe(limit)
      expect(result[0].id_challenge).toBe('1')
      expect(result[1].id_challenge).toBe('3')
      expect(result[2].id_challenge).toBe('2')

      const sortByPopularity = 'popularity'
      const isAscendingPopularity = true // Ascendente (de menos a más likes)

      console.log('valores', parsedChallenges)

      service.orderBySort(sortByPopularity, parsedChallenges, offset, limit, isAscendingPopularity).subscribe(result => {
        expect(result.length).toBe(limit)
        expect(result[0].id_challenge).toBe('1')
        expect(result[1].id_challenge).toBe('2')
        expect(result[2].id_challenge).toBe('3')
        done()
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
