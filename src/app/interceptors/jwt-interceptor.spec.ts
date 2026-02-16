import { TestBed } from '@angular/core/testing'
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing'
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http'
import { JwtInterceptor } from './jwt-interceptor'
import { CookieService } from 'ngx-cookie-service'
import { environment } from 'src/environments/environment'

describe('JwtInterceptor', () => {
  let httpMock: HttpTestingController
  let httpClient: HttpClient
  const apiUrl = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}/test`

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: CookieService, useValue: {} },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
      ]
    })
    httpMock = TestBed.inject(HttpTestingController)
    httpClient = TestBed.inject(HttpClient)
    sessionStorage.clear()
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should add auth header with token', () => {
    sessionStorage.setItem('authToken', 'token')
    httpClient.get(apiUrl).subscribe()
    expect(httpMock.expectOne(apiUrl).request.headers.get('Authorization')).toBe('Bearer token')
  })

  it('should NOT add header without token', () => {
    httpClient.get(apiUrl).subscribe()
    expect(httpMock.expectOne(apiUrl).request.headers.get('Authorization')).toBeNull()
  })

  it('should NOT add header for external URLs', () => {
    sessionStorage.setItem('authToken', 'token')
    httpClient.get('https://ext.com').subscribe()
    expect(httpMock.expectOne('https://ext.com').request.headers.get('Authorization')).toBeNull()
  })
})