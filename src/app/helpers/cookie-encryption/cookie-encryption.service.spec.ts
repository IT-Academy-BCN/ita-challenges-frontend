import { TestBed } from '@angular/core/testing';

import { CookieEncryptionService } from './cookie-encryption.service';

describe('CookieEncryptionService', () => {
  let service: CookieEncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookieEncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
