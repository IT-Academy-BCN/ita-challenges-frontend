import { TestBed, inject } from '@angular/core/testing'
import { SolutionService } from './solution.service'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

describe('Service: SendSolution', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [SolutionService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
  })

  it('should ...', inject([SolutionService], (service: SolutionService) => {
    expect(service).toBeTruthy()
  }))
})
