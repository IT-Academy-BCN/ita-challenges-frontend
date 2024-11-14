import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { SolutionService } from './solution.service'
import { environment } from 'src/environments/environment'
// import { type DataSolution } from '../models/data-solution.model'
// import { type UserSolution } from '../models/user-solution.interface'
import mockResponse from '../../mocks/solution/solution-sended.json'
import mockData from '../../mocks/solution/data-solution.json'
import mockUserSolution from '../../mocks/solution/user-solution.json'

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

    service.getUserSolution(userId, challengeId, languageId).subscribe(data => {
      expect(data.results[0].solutions[0].uuid).toEqual('dcacb291-b4aa-4029-8e9b-284c8ca80296')
      done()
    })

    const req = httpMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ITA_CHALLENGE_USER_SOLUTION}/user/${userId}/challenge/${challengeId}/language/${languageId}`)
    expect(req.request.method).toBe('GET')
    req.flush(mockUserSolution)
  })

  it('should fetch user solutions', (done) => {
    const userId = 'user123'

    service.fetchUserSolution(userId).subscribe((data) => {
      expect(data).toEqual(mockResponse)
      done()
    })

    const req = httpMock.expectOne(`${environment.USER_SOLUTION.replace('{idUser}', userId)}`)
    expect(req.request.method).toBe('GET')
    expect(req.request.headers.get('Content-Type')).toBe('application/json')
    req.flush(mockResponse)
  })
})
