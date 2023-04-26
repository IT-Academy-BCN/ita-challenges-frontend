import { TestBed } from '@angular/core/testing';

import { FilterChallengeService } from './filter-challenge.service';

describe('FilterChallengeService', () => {
  let service: FilterChallengeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterChallengeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
