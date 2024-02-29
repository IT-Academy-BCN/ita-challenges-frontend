import { TestBed } from '@angular/core/testing';
import { ItinerariesService } from './itineraries.service';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Itinerary } from '../models/itinerary.interface';
import { environment } from 'src/environments/environment';



describe('ItinerariesService', () => {
  let service: ItinerariesService;
  let httpClient: HttpClient;
  let httpClientMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ // set up the testing module with required dependencies.
      imports: [HttpClientTestingModule]
    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient); //TestBed.inject is used to inject into the test suite
    httpClientMock = TestBed.inject(HttpTestingController);

    service = TestBed.inject(ItinerariesService);
  });

  it('should be created itineraries.service', (done) => {
    expect(service).toBeTruthy();
    done();
  });

  it('should get itineraries succesfully', (done) => {
    const mockData: Itinerary[] = [
      {
        id: '1',
        name: 'mockName',
        slug: 'mockSlug',
      }
    ];

    httpClient.get<Itinerary[]>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_ITINERARIES)).subscribe((res) => {
      expect(res).toEqual(mockData);
      done();
    });

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_ITINERARIES));
    expect(req.request.method).toEqual('GET');
    req.flush(mockData);

  });

  it('should handle error when getting itineraries', (done) => {

    httpClient.get<Itinerary[]>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_ITINERARIES)).subscribe({
      next: () => {
        done.fail('Expected error but received next');
      },
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      }
    });

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_ITINERARIES));
    expect(req.request.method).toEqual('GET');

    req.error(new ProgressEvent('error', {
      lengthComputable: false,
      loaded: 0,
      total: 0,
    }));

    httpClientMock.verify();
  });
});