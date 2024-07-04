import { TestBed } from '@angular/core/testing'
import { SolutionService } from './solution.service'
// import { environment } from 'src/environments/environment'

describe('SolutionService', () => {
  let service: SolutionService
  // let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [SolutionService]
    })

    service = TestBed.inject(SolutionService)
    // httpMock = TestBed.inject(HttpTestingController)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('sendSolutionText should emit the provided solution', (done) => {
    const testSolution = true
    service.submitSolutionSubject.subscribe(value => {
      expect(value).toBe(testSolution)
      done()
    })
    service.sendSolutionText(testSolution)
  })
})
