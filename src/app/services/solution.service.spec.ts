import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { SolutionService } from './solution.service'
import { environment } from 'src/environments/environment'
// import { type DataSolution } from '../models/data-solution.model'
// import { type UserSolution } from '../models/user-solution.interface'
import mockData from '../../mocks/solution/data-solution.json'
import mockUserSolution from '../../mocks/solution/user-solution.json'
import { of } from 'rxjs'
import { AuthService } from './auth.service'
import { SolutionAction } from '../models/user-solution-action.enum'

describe('SolutionService', () => {
  let service: SolutionService
  let httpMock: HttpTestingController
  let uuid_challenge: string;
  let uuid_language: string;
  let uuid_user: string;
  let solution_text: string;
  let action: SolutionAction;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SolutionService,
        {
          provide: AuthService,
          useValue: {
            getUserId: jest.fn().mockReturnValue(of('mocked-user-id'))
          }
        }
      ]
    })

    service = TestBed.inject(SolutionService)
    httpMock = TestBed.inject(HttpTestingController)
    uuid_challenge = 'f6e0f877-9560-4e68-bab6-7dd5f16b46a5'
    uuid_language = '660e1b18-0c0a-4262-a28a-85de9df6ac5f'
    uuid_user = '12345'
    solution_text = 'Mi solución de prueba'
    action = SolutionAction.COMPLETED
  })

  afterEach(() => {
    httpMock.verify()
  })

const submissionsUrl = (userId: string) =>
  `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_SUBMISSIONS}${userId}/submissions`

const submissionsBody = (
  uuid_challenge: string,
  uuid_language: string,
  action: any,
  solution_text: string
) => ({
  uuid_challenge,
  uuid_language,
  action,
  submission_text: solution_text
})




  it('should be created', () => {
    expect(service).toBeTruthy()
  })

it('should not emit "submitted" if submission fails', (done) => {
  let emitted = false;

  service.sendSolutionText$.subscribe(() => {
    emitted = true;
  });

  const mockError = { status: 500, statusText: 'Internal Server Error' };

  service.submitSolution(uuid_challenge, uuid_language, uuid_user, action, solution_text).subscribe({
    error: (error) => {
      expect(error.status).toBe(500);
      expect(emitted).toBe(false); 
      done();
    }
  });

 const req = httpMock.expectOne(submissionsUrl(uuid_user))
  expect(req.request.method).toBe('POST')
  req.flush(null, mockError);
});


  it('should return all challenge solutions', (done) => {
    const testChallengeId = 'dcacb291-b4aa-4029-8e9b-284c8ca80296'
    const testLanguageId = '409c9fe8-74de-4db3-81a1-a55280cf92ef'

    service.getAllChallengeSolutions(testChallengeId, testLanguageId).subscribe(data => {
      expect(data.results[0].id_solution).toEqual('1682b3e9-056a-45b7-a0e9-eaf1e11775ad')
      done()
    })

    const req = httpMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_SOLUTION}/challenge/${testChallengeId}/language/${testLanguageId}`)
    expect(req.request.method).toBe('GET')
    req.flush(mockData)
  })

  it('should check the user solutions', (done) => {
    const challengeId = 'challenge123';
    const languageId = 'language123';

    const mockUserSolution = {
      uuid_user: '1a2b3c4d-5e6f-6a8b-9c0d-1e2f3a4b5c6d',
      uuid_challenge: challengeId,
      uuid_language: languageId,
      solution_text: 'Esta es la soluciÃ³n del usuario para el reto FizzBuzz'
    }

    service.getUserSolution(challengeId, languageId).subscribe(data => {
      expect(data.solution_text).toEqual('Esta es la soluciÃ³n del usuario para el reto FizzBuzz')
      done()
    })

    const req = httpMock.expectOne(
    `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_USER_SOLUTION}/challenge/${challengeId}/language/${languageId}`
    )

    expect(req.request.method).toBe('GET')
    req.flush(mockUserSolution)
})

  it('should fetch user solutions', (done) => {
    const mockUserId = 'mocked-user-id'
    const expectedUrl = submissionsUrl(mockUserId)

    service.fetchUserSolution().subscribe((data) => {
      expect(data).toEqual(mockUserSolution)
      done()
    })

    const req = httpMock.expectOne(expectedUrl)
    expect(req.request.method).toBe('GET')
    req.flush(mockUserSolution)
  })


  it('should send a POST request to submit solution', (done) => {
    const mockResponse = { success: true, message: 'Solution submitted successfully' }
  
    service.submitSolution(uuid_challenge, uuid_language, uuid_user, action, solution_text).subscribe({
      next: (response) => {
      expect(response).toEqual(mockResponse)
      done()
    }
  })
  
    const req = httpMock.expectOne(submissionsUrl(uuid_user))
  expect(req.request.method).toBe('POST')

     expect(req.request.body).toEqual(
    submissionsBody(uuid_challenge, uuid_language, action, solution_text)
  )

  req.flush(mockResponse)
})

  
 it('should handle error when submitting solution', (done) => {
  const mockError = { status: 500, statusText: 'Internal Server Error' }

  service
    .submitSolution(uuid_challenge, uuid_language, uuid_user, action, solution_text)
    .subscribe({
      next: () => fail('Expected error, but got success response'),
      error: (error) => {
        expect(error.status).toBe(500)
        expect(error.statusText).toBe('Internal Server Error')
        done()
      }
    })

  const req = httpMock.expectOne(
    `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_SUBMISSIONS}${uuid_user}/submissions`
  )

  expect(req.request.method).toBe('POST')

  req.flush(null, mockError)
})

  it('should handle missing user ID gracefully', (done) => {
    jest.spyOn(TestBed.inject(AuthService), 'getUserId').mockReturnValue(of(''))

    service.fetchUserSolution().subscribe((data) => {
      expect(data).toEqual([])
      done()
    })
  })

  it('should handle error from backend when fetching user solutions', (done) => {
  jest.spyOn(TestBed.inject(AuthService), 'getUserId').mockReturnValue(of('mocked-user-id'))

  const expectedUrl = submissionsUrl('mocked-user-id')
  const mockError = { status: 500, statusText: 'Internal Server Error' }

  service.fetchUserSolution().subscribe((data) => {
    expect(data).toEqual([])
    done()
  })

  const req = httpMock.expectOne(expectedUrl)
  expect(req.request.method).toBe('GET')
  req.flush(null, mockError)
})


  // Tests for updateSolutionSentState method only
describe('updateSolutionSentState', () => {
  beforeEach(() => {
    // Reset state before each test
    service['isUpdating'] = false;
    service['solutionSentSubject'].next(false);
  });

  it('should update immediately when value is false', () => {
    const nextSpy = spyOn(service['solutionSentSubject'], 'next');
    service.updateSolutionSentState(false);
    expect(nextSpy).toHaveBeenCalledWith(false);
  });

  it('should update immediately when force option is true', () => {
    const nextSpy = spyOn(service['solutionSentSubject'], 'next');
    service.updateSolutionSentState(true, { force: true });
    expect(nextSpy).toHaveBeenCalledWith(true);
  });

  it('should NOT update when isUpdating is true (prevents concurrent updates)', () => {
    service['isUpdating'] = true;
    const nextSpy = spyOn(service['solutionSentSubject'], 'next');
    service.updateSolutionSentState(false);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  it('should NOT update when current value equals new value', () => {
    // Set current value to true
    service['solutionSentSubject'].next(true);
    const nextSpy = spyOn(service['solutionSentSubject'], 'next');
    
    // Try to set same value
    service.updateSolutionSentState(true);
    
    expect(nextSpy).not.toHaveBeenCalled();
  });

  it('should update when value changes from false to true', () => {
    // Initial value is false
    service['solutionSentSubject'].next(false);
    const nextSpy = spyOn(service['solutionSentSubject'], 'next');
    
    service.updateSolutionSentState(true);
    
    expect(nextSpy).toHaveBeenCalledWith(true);
  });

  it('should reset isUpdating to false after updating', () => {
    service.updateSolutionSentState(false);
    expect(service['isUpdating']).toBe(false);
    
    service.updateSolutionSentState(true, { force: true });
    expect(service['isUpdating']).toBe(false);
  });
});
})

