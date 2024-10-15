import { TestBed } from '@angular/core/testing'
import { SolutionService } from './solution.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('SolutionService', () => {
  let service: SolutionService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SolutionService]
    })

    service = TestBed.inject(SolutionService)
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
