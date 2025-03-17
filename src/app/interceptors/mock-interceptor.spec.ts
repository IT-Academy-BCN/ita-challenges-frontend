import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpInterceptorFn } from '@angular/common/http';

import { MockInterceptor } from './mock-interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('mockInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => interceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true }
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('It must intercept a request to endpoint (/related) and return the mocked response.', () => {

    const challengeId = 'dcacb291-b4aa-4029-8e9b-284c8ca80296';
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}/${challengeId}/related`;
    http.get(url).subscribe(response => {
      expect(response).toEqual({
        count: 1,
        offset: 0,
        limit: 10,
        results: [
          {
            id_challenge: '2f948de0-6f0c-4089-90b9-7f70a0812319',
            challenge_title: {
              ES: 'Filtrado de Listas',
              CA: 'Filtratge de Llistes',
              EN: 'List Filtering'
            },
            languages: [
              {
                id_language: '660e1b18-0c0a-4262-a28a-85de9df6ac5f',
                language_name: 'Java',
                language_image: 'https://default-image.com/default.png'
              }
            ],
            level: 'EASY',
            creation_date: '2004-09-07',
            related: []
          }
        ]
      });
    });

    httpMock.expectNone(url);
  });

  it('You should allow requests to other URLs to pass through without modifying them.', () => {
    const testUrl = 'http://dev.ita-challenges.eurecatacademy.org/itachallenge/api/v1/challenge/challenges';

    http.get(testUrl).subscribe(response => {
      expect(response).toBeTruthy(); 
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toBe('GET');

    req.flush({ success: true });

  });
});