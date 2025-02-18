import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChallengeFormService } from './challenge-form.service';
import { environment } from 'src/environments/environment';

describe('ChallengeFormService', () => {
  let service: ChallengeFormService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChallengeFormService],
    });

    service = TestBed.inject(ChallengeFormService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch languages', () => {
    const mockLanguages = { results: [{ id_language: '1', language_name: 'JAVA' }] };

    service.getAllLangugesCreateForm().subscribe((res) => {
      expect(res).toEqual(mockLanguages);
    });

    const req = httpMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_LANGUAGE_URL}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLanguages);
  });

  it('should handle error when fetching languages', () => {
    service.getAllLangugesCreateForm().subscribe({
      next: () => fail('Expected error'),
      error: (err) => expect(err).toBeTruthy(),
    });

    httpMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_LANGUAGE_URL}`).error(new ProgressEvent('error'));
  });
});
