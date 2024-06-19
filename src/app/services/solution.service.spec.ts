
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SolutionService } from './solution.service';
import { environment } from 'src/environments/environment';

describe('SolutionService', () => {
  let service: SolutionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SolutionService]
    });

    service = TestBed.inject(SolutionService);
    httpMock = TestBed.inject(HttpTestingController);
  });



  it('should fetch all challenge solutions', () => {
    const mockDataSolution = {   
      count: 1,
      offset: 1,
      limit: 1,
      results: [
        {
        id_solution: '123',
        solution_text: 'solution text 1',
        uuid_language: '123a',
        uuid_challenge: '123b'
        },         
        {
        id_solution: '456',
        solution_text: 'solution text 2',
        uuid_language: '456c',
        uuid_challenge: '456d'
        }
      ]  };

    service.getAllChallengeSolutions('testChallengeId', 'testLanguageId').subscribe(data => {
      expect(data).toEqual(mockDataSolution);
    });

    const req = httpMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_SOLUTION}/testChallengeId/language/testLanguageId`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDataSolution);
  });

  it('should fetch if user solution is sent', () => {
    const mockUserSolution = {   
      count: 1,
      offset: 1,
      limit: 1,
      results: [
        {
            id_challenge: "7fc6a737-dc36-4e1b-87f3-120d81c548aa",
            language: "1e047ea2-b787-49e7-acea-d79e92be3909",
            id_user: "c3a92f9d-5d10-4f76-8c0b-6d884c549b1c",
            solutions: [
                {
                    uuid: "dcacb291-b4aa-4029-8e9b-284c8ca80296",
                    solutionText: "Sed dictum. Proin eget odio. Aliquam vulputate ullamcorper magna. Sed eu eros. Nam consequat dolor vitae dolor. Donec fringilla. Donec"
                }
            ]
        }
      ]  
    };

    service.isUserSolutionSent('c3a92f9d-5d10-4f76-8c0b-6d884c549b1c', '7fc6a737-dc36-4e1b-87f3-120d81c548aa', '1e047ea2-b787-49e7-acea-d79e92be3909').subscribe(data => {
      expect(data).toEqual(mockUserSolution);
    });

    const req = httpMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_USER_SOLUTION}/user/c3a92f9d-5d10-4f76-8c0b-6d884c549b1c/challenge/7fc6a737-dc36-4e1b-87f3-120d81c548aa/language/1e047ea2-b787-49e7-acea-d79e92be3909`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserSolution);
  });
});