import { TestBed } from '@angular/core/testing';
import { ResourcesService } from './resources.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

describe('ResourcesService', () => {
  let resourcesService: ResourcesService;
  let httpClient: HttpClient;
  let httpClientMock: HttpTestingController;

  beforeEach(() => {


    TestBed.configureTestingModule({ // set up the testing module with required dependencies.
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.inject(HttpClient);
    httpClientMock = TestBed.inject(HttpTestingController);

    resourcesService = new ResourcesService(httpClient);

  });

  afterEach(() => {
    httpClientMock.verify();
  })

  it('should be created', () => {
    expect(resourcesService).toBeTruthy();
  });

  it('should return resources response correctly', (done) => {

    let responseMock = {
      "id": "e7b6b5a0-5b0a-4b0e-8b0a-9b0a0b0a0b0a",
      "title": "Tutorial completo de Angular desde cero",
      "slug": "tutorial-completo-de-angular-desde-cero",
      "description": "Tutorial completo de Angular desde cero hasta la creación de una aplicación de gestión de tareas",
      "url": "https://tutorials.cat/learn/angular",
      "resourceType": "BLOG",
      "userId": "string",
      "categoryId": "clocr0bi20000h8vwipfbazso",
      "createdAt": "Mar 25, 2023",
      "updatedAt": "Mar 25, 2023",
      "user": {
        "name": "Ana Pérez"
      },
      "topics": [
        {
          "topic": {
            "id": "string",
            "name": "Angular",
            "slug": "angular",
            "categoryId": "string",
            "createdAt": "string",
            "updatedAt": "string"
          }
        }
      ],
      "voteCount": {
        "upvote": 14,
        "downvote": 2,
        "total": 12,
        "userVote": 1
      },
      "isFavorite": false
    }

    resourcesService.getResources().subscribe(response => {
      expect(response).toEqual(responseMock);
      done();
    })

    let req = httpClientMock.expectOne(environment.BACKEND_SSO_RESOURCES);
    expect(req.request.method).toEqual('GET');

    req.flush(responseMock);
  });

  it('should return resources response error', (done) => {
    const errorMessage = 'Error fetching resources';
    const status = 500;

    resourcesService.getResources().subscribe({
      error: err => {
        expect(err.status).toEqual(status);
        expect(err.error).toEqual(errorMessage);
        done();
      }
    });

    const req = httpClientMock.expectOne(environment.BACKEND_SSO_RESOURCES);
    expect(req.request.method).toEqual('GET');

    req.flush(errorMessage, { status, statusText: 'Internal Server Error' });
  });
});
