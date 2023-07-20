import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SendSolutionService } from './send-solution.service';
import { environment } from '../../environments/environment';

//s'haurà d'ajustar en funció del que retorni backend

describe('SendSolutionService', () => {
  let service: SendSolutionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SendSolutionService]
    });

    service = TestBed.inject(SendSolutionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send solution to backend', () => {
    const dummySolution = 'dummySolution';

    service.sendSolutionToBackend(dummySolution).subscribe(res => {
      expect(res).toEqual(dummySolution);
    });

    const req = httpMock.expectOne(`${environment.BACKEND_BASE_URL}${environment.BACKEND_SEND_SOLUTION}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummySolution);
  });
});
