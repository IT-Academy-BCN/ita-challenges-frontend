import { ChallengeService } from './challenge.service'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { environment } from 'src/environments/environment'
import { type Itinerary } from '../models/itinerary.interface'
import { type CreateChallenge } from '../models/create-challenge.interface'
import { AuthService } from './auth.service'

const authServiceStub = {
  getAuthHeaders: () => ({ Authorization: 'Bearer mock-token' })
}

describe('ChallengeService', () => {
  let service: ChallengeService
  let httpMock: HttpTestingController
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceStub }
      ]
    })
    service = TestBed.inject(ChallengeService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
    TestBed.resetTestingModule()
  })

  // Helper para endpoints POST/DELETE
  function expectEndpoint (
    path: string,
    method: 'POST' | 'DELETE',
    response: object,
    status = 200,
    statusText = 'OK'
  ): void {
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${path}`
    const req = httpMock.expectOne(url)
    expect(req.request.method).toBe(method)
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token')
    if (method === 'POST') {
      expect(req.request.body).toEqual({})
    }
    req.flush(response, { status, statusText })
  }

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  // Itineraries tests
  it('should get itineraries successfully', async () => {
    const mockData: Itinerary[] = [{ id: '1', name: 'mockName', slug: 'mockSlug' }]
    const promise = service.getItineraries()
    const req = httpMock.expectOne(
      `${environment.BACKEND_ITA_SSO_BASE_URL}${environment.BACKEND_SSO_ITINERARIES}`
    )
    expect(req.request.method).toBe('GET')
    req.flush(mockData)
    const res = await promise
    expect(res).toEqual(mockData)
  })

  it('should handle error when getting itineraries', async () => {
    const promise = service.getItineraries()
    const req = httpMock.expectOne(
      `${environment.BACKEND_ITA_SSO_BASE_URL}${environment.BACKEND_SSO_ITINERARIES}`
    )
    req.error(new ProgressEvent('error'))
    await expect(promise).rejects.toBeTruthy()
  })

  // Languages test
  it('should call getAllLanguages() and return data', () => {
    const mockResponse = { results: [{ language_name: 'JS', id_language: 1 }] }
    service.getAllLanguages().subscribe(data => {
      expect(data).toEqual(mockResponse)
    })
    const req = httpMock.expectOne(
      `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_LANGUAGE_URL}`
    )
    expect(req.request.method).toBe('GET')
    req.flush(mockResponse)
  })

  // Create challenge test
  it('should create challenge and return response', (done) => {
    const mockChallenge: CreateChallenge = { challengeTitle: 'T', description: 'D', level: 'EASY', language: 'Java', solution: 'S', topic: 'ALL', tags: [] }
    const mockResp = { id: 1, ...mockChallenge }
    service.createChallenge(mockChallenge).subscribe(res => {
      expect(res).toEqual(mockResp)
      done()
    })
    const req = httpMock.expectOne(
      `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`
    )
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual(mockChallenge)
    req.flush(mockResp)
  })

  // Parametrized tests for Favorites and Bookmarks
  interface ApiCase {
    name: string
    addFn: keyof ChallengeService
    removeFn: keyof ChallengeService
    pathBase: string
    successAdd: object
    successRemove: object
    errorStrategy: 'default' | 'propagate'
    defaultOnError?: object
  }

  const apiCases: ApiCase[] = [
    {
      name: 'favorites',
      addFn: 'addToFavorites',
      removeFn: 'removeFromFavorites',
      pathBase: `${environment.BACKEND_ALL_CHALLENGES_URL}/`,
      successAdd: { favorite: true, timesFavorited: 42 },
      successRemove: { favorite: false, timesFavorited: 41 },
      errorStrategy: 'default',
      defaultOnError: { favorite: false, timesFavorited: 0 }
    },
    {
      name: 'bookmarks',
      addFn: 'addBookmark',
      removeFn: 'removeBookmark',
      pathBase: `${environment.BACKEND_ALL_CHALLENGES_URL}/`,
      successAdd: { bookmarked: true, timesBookmarked: 5 },
      successRemove: { bookmarked: false, timesBookmarked: 4 },
      errorStrategy: 'propagate'
    }
  ]

  apiCases.forEach(c => {
    describe(c.name, () => {
      const id = 'test-id'
      const path = `${c.pathBase}${id}/${c.name}`

      it(`should add ${c.name}`, done => {
        (service[c.addFn] as any)(id).subscribe({
          next: (res: any) => { expect(res).toEqual(c.successAdd); done() },
          error: (err: any) => done.fail(`Unexpected error: ${err}`)
        })
        expectEndpoint(path, 'POST', c.successAdd)
      })

      it(`should remove ${c.name}`, done => {
        (service[c.removeFn] as any)(id).subscribe({
          next: (res: any) => { expect(res).toEqual(c.successRemove); done() },
          error: (err: any) => done.fail(`Unexpected error: ${err}`)
        })
        expectEndpoint(path, 'DELETE', c.successRemove)
      })

      it(`should handle error on add ${c.name}`, done => {
        (service[c.addFn] as any)(id).subscribe({
          next: (res: any) => {
            if (c.errorStrategy === 'propagate') {
              done.fail('Expected error')
            } else {
              expect(res).toEqual(c.defaultOnError)
              done()
            }
          },
          error: (err: any) => {
            if (c.errorStrategy === 'propagate') {
              expect(err.status).toBe(500)
              done()
            } else {
              done.fail(`Unexpected error: ${err}`)
            }
          }
        })
        expectEndpoint(path, 'POST', { message: 'Err' }, 500, 'Err')
      })

      it(`should propagate error on remove ${c.name}`, done => {
        (service[c.removeFn] as any)(id).subscribe({
          next: () => done.fail('Expected error'),
          error: (err: any) => { expect(err.status).toBe(500); done() }
        })
        expectEndpoint(path, 'DELETE', { message: 'Err' }, 500, 'Err')
      })
    })
  })
})
