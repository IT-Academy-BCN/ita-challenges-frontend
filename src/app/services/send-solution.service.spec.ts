/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SendSolutionService } from './send-solution.service';

describe('Service: SendSolution', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SendSolutionService]
    });
  });

  it('should ...', inject([SendSolutionService], (service: SendSolutionService) => {
    expect(service).toBeTruthy();
  }));
});
