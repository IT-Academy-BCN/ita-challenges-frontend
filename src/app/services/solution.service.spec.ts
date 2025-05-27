import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { SolutionService } from './solution.service'
import { environment } from 'src/environments/environment'
// import { type DataSolution } from '../models/data-solution.model'
// import { type UserSolution } from '../models/user-solution.interface'
import mockResponse from '../../mocks/solution/solution-sended.json'
import mockData from '../../mocks/solution/data-solution.json'
import mockUserSolution from '../../mocks/solution/user-solution.json'
import { SolutionStatus } from '../models/user-solution-status.enum'
import { of } from 'rxjs'
import { AuthService } from './auth.service'

describe('SolutionService', () => {
  let service: SolutionService
  let httpMock: HttpTestingController

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
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should update solution sent state', (done) => {
    service.updateSolutionSentState(true)
    service.solutionSent$.subscribe(value => {
      expect(value).toBe(true)
      done()
    })
  })

  it('should send solution and update state', (done) => {
    service.sendSolution('test solution')
    service.solutionSent$.subscribe(value => {
      expect(value).toBe(true)
      done()
    })
  })

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
      solution_text: 'Esta es la solución del usuario para el reto FizzBuzz'
    }

    service.getUserSolution(challengeId, languageId).subscribe(data => {
      expect(data.solution_text).toEqual('Esta es la solución del usuario para el reto FizzBuzz')
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
    const expectedUrl = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.USER_SOLUTION}${mockUserId}/solutions`

    service.fetchUserSolution().subscribe((data) => {
      expect(data).toEqual(mockUserSolution)
      done()
    })

    const req = httpMock.expectOne(expectedUrl)
    expect(req.request.method).toBe('GET')
    req.flush(mockUserSolution)
  })

  it('should send the correct data in PUT request', () => {
  const uuid_challenge = 'f6e0f877-9560-4e68-bab6-7dd5f16b46a5';
  const uuid_language = '660e1b18-0c0a-4262-a28a-85de9df6ac5f';
  const uuid_user = 'user123';
  const solution_text = 'Mi solución de prueba';
  const status = 'ENDED';

  const mockResponse = { success: true };

  service.submitSolution(uuid_challenge, uuid_language, uuid_user, status, solution_text).subscribe(response => {
    expect(response.success).toBe(true);
  });

  const req = httpMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_USER_SOLUTION}`);
  expect(req.request.method).toBe('PUT');
  expect(req.request.body).toEqual({
    uuid_challenge,
    uuid_language,
    uuid_user,
    solution_text,
    status
  });

  req.flush(mockResponse);
});

  it('should send a PUT request to submit solution', (done) => {
    const uuid_challenge = 'f6e0f877-9560-4e68-bab6-7dd5f16b46a5';
    const uuid_language = '660e1b18-0c0a-4262-a28a-85de9df6ac5f';
    const uuid_user = '12345';
    const solution_text = 'Mi solución de prueba';
    const status = SolutionStatus.ENDED;
  
    const mockResponse = { success: true, message: 'Solution submitted successfully' };
  
    service.submitSolution(uuid_challenge, uuid_language, uuid_user, status, solution_text).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.message).toBe('Solution submitted successfully');
      done();
    });
  
    const req = httpMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_USER_SOLUTION}`);
    expect(req.request.method).toBe('PUT');
    
    expect(req.request.body).toEqual({
      uuid_challenge,
      uuid_language,
      uuid_user,
      solution_text,
      status
    });
  
    req.flush(mockResponse);
  });

  
  it('should handle error when submitting solution', (done) => {
  const uuid_challenge = 'f6e0f877-9560-4e68-bab6-7dd5f16b46a5';
  const uuid_language = '660e1b18-0c0a-4262-a28a-85de9df6ac5f';
  const uuid_user = 'user123';
  const solution_text = 'Mi solución de prueba';
  const status = SolutionStatus.ENDED;

  const mockError = { status: 500, statusText: 'Internal Server Error' };

  service.submitSolution(uuid_challenge, uuid_language, uuid_user, solution_text, status).subscribe(
    () => fail('Expected error, but got success response'),
    (error) => {
      expect(error.status).toBe(500);
      expect(error.statusText).toBe('Internal Server Error');
      done();
    }
  );

  const req = httpMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_USER_SOLUTION}`);
  expect(req.request.method).toBe('PUT');
  req.flush(null, mockError);
});
})
