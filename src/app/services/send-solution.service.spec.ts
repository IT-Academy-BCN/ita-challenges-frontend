/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SendSolutionService } from './send-solution.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: SendSolution', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [SendSolutionService]
    });
  });

  it('should ...', inject([SendSolutionService], (service: SendSolutionService) => {
    expect(service).toBeTruthy();
  }));
});
