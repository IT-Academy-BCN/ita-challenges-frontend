import { TestBed } from '@angular/core/testing'
import { ResourcesService } from './resources.service'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
// import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
// import { responseMock } from 'src/mocks/resources/response.mock'
import responseMock from 'src/mocks/resources/response-resource.mock.json'

describe('ResourcesService', () => {
  let resourcesService: ResourcesService
  let httpClientMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ResourcesService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })

    httpClientMock = TestBed.inject(HttpTestingController)
    resourcesService = TestBed.inject(ResourcesService)
  })

  afterEach(() => {
    httpClientMock.verify()
  })

  it('should be created', () => {
    expect(resourcesService).toBeTruthy()
  })

  it('should return resources response correctly', (done) => {
    resourcesService.getResources().subscribe(response => {
      expect(response).toEqual(responseMock)
      done()
    })

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_WIKI_BASE_URL.concat(environment.BACKEND_SSO_RESOURCES))
    expect(req.request.method).toEqual('GET')

    req.flush(responseMock)
  })

  it('should return resources response error', (done) => {
    const errorMessage = 'Error fetching resources'
    const status = 500

    resourcesService.getResources().subscribe({
      error: err => {
        expect(err.status).toEqual(status)
        expect(err.error).toEqual(errorMessage)
        done()
      }
    })

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_WIKI_BASE_URL.concat(environment.BACKEND_SSO_RESOURCES))
    expect(req.request.method).toEqual('GET')

    req.flush(errorMessage, { status, statusText: 'Internal Server Error' })
  })
})
