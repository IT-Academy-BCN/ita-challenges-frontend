import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { SolutionService } from './solution.service'
import { environment } from 'src/environments/environment'
import { type DataSolution } from '../models/data-solution.model'
import { type UserSolution } from '../models/user-solution.interface'

describe('SolutionService', () => {
  let service: SolutionService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SolutionService]
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
    const mockData: DataSolution = {
      offset: 0,
      limit: 2,
      count: 2,
      results: [
        {
          id_solution: '1682b3e9-056a-45b7-a0e9-eaf1e11775ad',
          solution_text: 'Sample solution text',
          uuid_language: '409c9fe8-74de-4db3-81a1-a55280cf92ef',
          uuid_challenge: 'dcacb291-b4aa-4029-8e9b-284c8ca80296'
        },
        {
          id_solution: 'a7a789a9-2006-4b59-94bb-3afe0d1c161d',
          solution_text: 'Another solution text',
          uuid_language: '409c9fe8-74de-4db3-81a1-a55280cf92ef',
          uuid_challenge: 'dcacb291-b4aa-4029-8e9b-284c8ca80296'
        }
      ]
    }

    service.getAllChallengeSolutions(testChallengeId, testLanguageId).subscribe(data => {
      expect(data.results[0].id_solution).toEqual('1682b3e9-056a-45b7-a0e9-eaf1e11775ad')
      done()
    })

    const req = httpMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_SOLUTION}/${testChallengeId}/language/${testLanguageId}`)
    expect(req.request.method).toBe('GET')
    req.flush(mockData)
  })

  it('should check the user solutions', (done) => {
    const userId = 'user123'
    const challengeId = 'challenge123'
    const languageId = 'language123'
    const mockUserSolution: UserSolution = {
      offset: 0,
      limit: 1,
      count: 0,
      results: [
        {
          id_challenge: '7fc6a737-dc36-4e1b-87f3-120d81c548aa',
          language: '1e047ea2-b787-49e7-acea-d79e92be3909',
          id_user: 'c3a92f9d-5d10-4f76-8c0b-6d884c549b1c',
          solutions: [
            {
              uuid: 'dcacb291-b4aa-4029-8e9b-284c8ca80296',
              solutionText: 'Sed dictum. Proin eget odio. Aliquam vulputate ullamcorper magna. Sed eu eros. Nam consequat dolor vitae dolor. Donec fringilla. Donec'
            }
          ]
        }
      ]
    }

    service.getUserSolution(userId, challengeId, languageId).subscribe(data => {
      expect(data.results[0].solutions[0].uuid).toEqual('dcacb291-b4aa-4029-8e9b-284c8ca80296')
      done()
    })

    const req = httpMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_USER_SOLUTION}/user/${userId}/challenge/${challengeId}/language/${languageId}`)
    expect(req.request.method).toBe('GET')
    req.flush(mockUserSolution)
  })
})
