import { TestBed } from '@angular/core/testing';

import { RegisterUsersService } from './register-users.service';

describe('RegisterUsersService', () => {
  let service: RegisterUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
