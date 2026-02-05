import { ChallengeService } from './challenge.service'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { environment } from 'src/environments/environment'
import { type Itinerary } from '../models/itinerary.interface'
import { type CreateChallenge } from '../models/create-challenge.interface'
import { AuthService } from './auth.service'
import { HttpErrorResponse } from '@angular/common/http'
import { type Challenge } from '../models/challenge.model'

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

  function expectEndpoint(
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

  it('should create challenge and return response', (done) => {
    const mockChallenge: CreateChallenge = {
      challengeTitle: 'T',
      description: 'D',
      level: 'EASY',
      language: 'Java',
      solution: 'S',
      topic: 'ALL',
      tags: []
    }
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
      pathBase: `${environment.BACKEND_ITA_FAVORITES}/`,
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

      const buildPath = () =>
        c.name === 'favorites'
          ? `${c.pathBase}${id}`
          : `${c.pathBase}${id}/${c.name}`

      it(`should add ${c.name}`, done => {
        (service[c.addFn] as any)(id).subscribe({
          next: (res: any) => { expect(res).toEqual(c.successAdd); done() },
          error: (err: any) => done.fail(`Unexpected error: ${err}`)
        })
        expectEndpoint(buildPath(), 'POST', c.successAdd)
      })

      it(`should remove ${c.name}`, done => {
        (service[c.removeFn] as any)(id).subscribe({
          next: (res: any) => { expect(res).toEqual(c.successRemove); done() },
          error: (err: any) => done.fail(`Unexpected error: ${err}`)
        })
        expectEndpoint(buildPath(), 'DELETE', c.successRemove)
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
        expectEndpoint(buildPath(), 'POST', { message: 'Err' }, 500, 'Err')
      })

      it(`should propagate error on remove ${c.name}`, done => {
        (service[c.removeFn] as any)(id).subscribe({
          next: () => done.fail('Expected error'),
          error: (err: any) => { expect(err.status).toBe(500); done() }
        })
        expectEndpoint(buildPath(), 'DELETE', { message: 'Err' }, 500, 'Err')
      })
    })
      it('should call getUserFavorites() and return data with the new userinteraction path', () => {
          const userId = '123'
          const mockFavorites: string[] = ['challenge1', 'challenge2', 'challenge3']

          service.getUserFavorites(userId).subscribe(favorites => {
            expect(favorites).toEqual(mockFavorites)
          })

          const expectedUrl = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_USERINTERACTION_FAVORITES}/${userId}`

          const req = httpMock.expectOne(expectedUrl)
          expect(req.request.method).toBe('GET')
          expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token')

          req.flush(mockFavorites)
      })
    })
  it('should call getUserBookmarks() and return data with the new user subresource path', () => {
    const userId = '123'
    const mockBookmarks: string[] = ['challenge1', 'challenge2']
    service.getUserBookmarks(userId).subscribe(bookmarks => {
      expect(bookmarks).toEqual(mockBookmarks)
    })
    const expectedUrl = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_USER_BOOKMARKS_PATH}/${userId}/bookmarks`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET')
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token')

    req.flush(mockBookmarks)
  })

  describe('getRelatedChallenges', () => {
    const mockChallengeId = '12345';
    const mockChallenges = [
      { id: '1', title: 'Challenge 1' },
      { id: '2', title: 'Challenge 2' }
    ];

    it('should fetch related challenges successfully', () => {
      
      service.getRelatedChallenges(mockChallengeId).subscribe(challenges => {
       
        expect(challenges).toEqual(mockChallenges);
      });

  
      const expectedUrl = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}/challenge/challenges/${mockChallengeId}/related`;
      const req = httpMock.expectOne(expectedUrl);
      
      
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');

      
      req.flush({ results: mockChallenges });
    });

    it('should handle empty response', () => {
      service.getRelatedChallenges(mockChallengeId).subscribe(challenges => {
        expect(challenges).toEqual([]);
      });

      const req = httpMock.expectOne(
        `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}/challenge/challenges/${mockChallengeId}/related`
      );
      req.flush({ results: [] });
    });

    it('should handle HTTP errors', () => {
      const mockError = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found'
      });

      
      jest.spyOn(console, 'error').mockImplementation(() => {});

      service.getRelatedChallenges(mockChallengeId).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toEqual(404);
          expect(console.error).toHaveBeenCalledWith('Error fetching related challenges:', mockError);
        }
      });

      const req = httpMock.expectOne(
        `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}/challenge/challenges/${mockChallengeId}/related`
      );
      req.flush(null, mockError);
    });

    it('should pass with invalid challenge ID', () => {
      const invalidId = 'invalid-id';
      service.getRelatedChallenges(invalidId).subscribe(challenges => {
        expect(challenges).toEqual(mockChallenges);
      });

      const req = httpMock.expectOne(
        `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}/challenge/challenges/${invalidId}/related`
      );
      req.flush({ results: mockChallenges });
    });
  });

  describe('editChallenge', () => {
    const mockChallengeId = '12345';
    const mockChallengeData: Partial<Challenge> = { challenge_title: 'Updated Challenge Title' };
    const mockSuccessResponse: Challenge = {
      id_challenge: '12345',
      challenge_title: 'Updated Challenge Title',
      level: 'easy',
      creation_date: new Date(),
      popularity: 10,
      favorites_count: 5,
      saved_count: 2,
      timesFavorite: 5,
      detail: {
        description: 'description',
        examples: [],
        notes: 'notes'
      },
      languages: [],
      solutions: [],
      timesSolved: 1,
      bookmarked: false
    };

    it('should update a challenge successfully', () => {
      service.editChallenge(mockChallengeId, mockChallengeData).subscribe(response => {
        expect(response).toEqual(mockSuccessResponse);
      });

      const req = httpMock.expectOne(
        `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_EDIT_CHALLENGE_URL}/${mockChallengeId}/update`
      );
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
      expect(req.request.body).toEqual(mockChallengeData);
      req.flush(mockSuccessResponse);
    });

    it('should handle HTTP errors on update', () => {
      const mockError = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error'
      });

      jest.spyOn(console, 'error').mockImplementation(() => {});

      service.editChallenge(mockChallengeId, mockChallengeData).subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
      
        expect(error.status).toEqual(500);
     
      }
    });

      const req = httpMock.expectOne(
        `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_EDIT_CHALLENGE_URL}/${mockChallengeId}/update`
      );
      req.flush(null, mockError);
    });
  });
})
