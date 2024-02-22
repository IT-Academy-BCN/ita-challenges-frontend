import { TestBed } from '@angular/core/testing';

import { ValidatiorsService } from './validatiors.service';

describe('ValidatiorsService', () => {
  let service: ValidatiorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidatiorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
