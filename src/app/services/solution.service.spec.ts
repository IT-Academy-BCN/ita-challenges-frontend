import { TestBed, inject } from '@angular/core/testing'
import { SolutionService } from './solution.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('Service: SendSolution', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SolutionService]
    })
  })

  it('should ...', inject([SolutionService], (service: SolutionService) => {
    expect(service).toBeTruthy()
  }))
})
