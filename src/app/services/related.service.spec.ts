import { TestBed } from '@angular/core/testing'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { environment } from 'src/environments/environment'
import { RelatedService } from './related.service'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
// import { responseMock } from 'src/mocks/challenge/response.mock'
import responseMock from 'src/mocks/challenge/response.mock.json'

describe('RelatedService', () => {
  let relatedService: RelatedService
  let httpClientMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [RelatedService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
