import { ChallengeService } from './challenge.service'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing'
import { environment } from 'src/environments/environment'
import { type Itinerary } from '../models/itinerary.interface'
import { type CreateChallenge } from '../models/create-challenge.interface'
import { type FavoriteResponse } from '../models/favorite-response.interface'
import { AuthService } from './auth.service'

/* Observable Test, see https://docs.angular.lat/guide/testing-components-scenarios */

const authServiceStub = {
  getAuthHeaders: () => ({ Authorization: 'Bearer mock-token' })
}

describe('ChallengeService', () => {
  let service: ChallengeService
  let httpClient: HttpClient
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceStub }
      ]
    })
    service = TestBed.inject(ChallengeService)
    httpClient = TestBed.inject(HttpClient)
    httpMock = TestBed.inject(HttpTestingController)
  })

  /*
    Some explanations:
    RxJs introduced the following syntax when writing marble tests in our code
        - ' ' the whitespace is a unique character that will not be interpreted; it can be used to align your marble string.
        - '-' represents a frame of virtual time passing
        - '|' This sign illustrates the completion of an observable.
        - '#' Signifies an error
        - [a-z] an alphanumeric character represents a value which is emitted by the Observable.
        - '()' used to group events in the same frame. This can be used to group values, errors, and completion.
        - '^' this sign illustrates the subscription point and will only be used when we are dealing with hot observables.

    That’s the basic syntax. Let’s look at some examples to make ourself more familiar with the syntax.
        - --: equivalent to NEVER. An observable that never emits
        - a--b--c| : an Observable that emits a on the first frame, b on the fourth and c on the seventh. After emitting c the observable completes.
        - ab--# : An Observable that emits a on frame two, b on frame three and an error on frame six.
        - a^(bc)--|: A hot Observable that emits a before the subscription.
     */

  it('should be created itineraries.service', (done) => {
    expect(service).toBeTruthy()
    done()
  })

  it('should get itineraries succesfully', (done) => {
    const mockData: Itinerary[] = [
      {
        id: '1',
        name: 'mockName',
        slug: 'mockSlug'
      }
    ]

    httpClient.get<Itinerary[]>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_ITINERARIES)).subscribe((res) => {
      expect(res).toEqual(mockData)
      done()
    })

    const req = httpMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_ITINERARIES))
    expect(req.request.method).toEqual('GET')
    req.flush(mockData)
  })

  it('should handle error when getting itineraries', (done) => {
    httpClient.get<Itinerary[]>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_ITINERARIES)).subscribe({
      next: () => {
        done.fail('Expected error but received next')
      },
      error: (err) => {
        expect(err).toBeTruthy()
        done()
      }
    })

    const req = httpMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_ITINERARIES))
    expect(req.request.method).toEqual('GET')

    req.error(new ProgressEvent('error', {
      lengthComputable: false,
      loaded: 0,
      total: 0
    }))

    httpMock.verify()
  })
  it('should call getAllLanguages() and return data', inject([ChallengeService, HttpTestingController],
    (service: ChallengeService, httpMock: HttpTestingController) => {
      const mockResponse = {
        results: [
          { language_name: 'JavaScript', id_language: 1 },
          { language_name: 'Python', id_language: 2 }
        ]
      }

      service.getAllLanguages().subscribe((data) => {
        expect(data).toEqual(mockResponse)
      })

      const req = httpMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_LANGUAGE_URL}`)
      expect(req.request.method).toEqual('GET')

      req.flush(mockResponse)
      httpMock.verify()
    }))

  it('should call createChallenge() and return the created challenge', (done) => {
    const mockChallenge: CreateChallenge = {
      challengeTitle: 'Test Challenge',
      description: 'Test Description',
      level: 'EASY',
      language: 'Java',
      solution: 'Test Solution',
      topic: 'ALL',
      tags: []
    }

    const mockResponse = { id: 1, ...mockChallenge }

    service.createChallenge(mockChallenge).subscribe((response) => {
      expect(response).toEqual(mockResponse)
      done()
    })

    const req = httpMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`)
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual(mockChallenge)

    req.flush(mockResponse)
    httpMock.verify()
  })

  describe('addToFavorites (real HTTP)', () => {
    const testId = 'test-challenge-123'

    beforeEach(() => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          { provide: AuthService, useValue: authServiceStub }
        ]
      })
      service = TestBed.inject(ChallengeService)
      httpMock = TestBed.inject(HttpTestingController)
    })

    afterEach(() => {
      httpMock.verify()
    })

    it('should POST and return backend response', (done) => {
      const mockResp: FavoriteResponse = { isFavorite: true, timesFavorited: 42 }

      service.addToFavorites(testId).subscribe((res) => {
        expect(res).toEqual(mockResp)
        done()
      })

      const req = httpMock.expectOne(
        `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}/challenge/challenges/${testId}/favorites`
      )
      expect(req.request.method).toBe('POST')
      expect(req.request.body).toEqual({})
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token')
      req.flush(mockResp)
    })

    it('should catch error and return default', (done) => {
      service.addToFavorites(testId).subscribe((res) => {
        expect(res).toEqual({ isFavorite: false, timesFavorited: 0 })
        done()
      })

      const req = httpMock.expectOne(
        `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}/challenge/challenges/${testId}/favorites`
      )
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Error' })
    })
  })

  describe('removeFromFavorites (real HTTP)', () => {
    const testId = 'test-challenge-123'
    beforeEach(() => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          { provide: AuthService, useValue: authServiceStub }
        ]
      })
      service = TestBed.inject(ChallengeService)
      httpMock = TestBed.inject(HttpTestingController)
    })
    afterEach(() => {
      httpMock.verify()
    })
    it('should DELETE and return backend response', (done) => {
      const mockResp: FavoriteResponse = { isFavorite: false, timesFavorited: 41 }
      service.removeFromFavorites(testId).subscribe((res) => {
        expect(res).toEqual(mockResp)
        done()
      })
      const req = httpMock.expectOne(
        `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}/challenge/challenges/${testId}/favorites`
      )
      expect(req.request.method).toBe('DELETE')
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token')
      req.flush(mockResp)
    })
    it('should propagate error when remove fails', (done) => {
      service.removeFromFavorites(testId).subscribe({
        next: () => {
          fail('Expected an error, but got a success response')
        },
        error: (err) => {
          expect(err.status).toBe(500)
          expect(err.statusText).toBe('Server Error')
          done()
        }
      })
      const req = httpMock.expectOne(
        `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}/challenge/challenges/${testId}/favorites`
      )
      expect(req.request.method).toBe('DELETE')
      req.flush({ message: 'Error' }, { status: 500, statusText: 'Server Error' })
    })
  })
})
