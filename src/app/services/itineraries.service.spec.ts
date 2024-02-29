import { TestBed } from '@angular/core/testing';
import { ItinerariesService } from './itineraries.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';



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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
