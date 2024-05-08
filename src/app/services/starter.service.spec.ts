import { StarterService } from "./starter.service";
import { TestScheduler } from "rxjs/internal/testing/TestScheduler";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { delay, of } from "rxjs";
import data from "./../../assets/dummy/data-challenge.json"; //see data-typings.d.ts
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { TestBed } from "@angular/core/testing";


/* Observable Test, see https://docs.angular.lat/guide/testing-components-scenarios */
describe('StarterService', () => {

  let service: StarterService;
  // let httpClientSpy: any;
  let testScheduler: TestScheduler;
  let httpClient: HttpClient;
  let httpClientMock: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({ // set up the testing module with required dependencies.
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient); //TestBed.inject is used to inject into the test suite
    httpClientMock = TestBed.inject(HttpTestingController);
    service = new StarterService(httpClient);
    testScheduler = new TestScheduler((actual, expected) => {
    });

  });

  /*
  Some explanations:
  RxJs introduced the following syntax when writing marble tests in our code
      - ' ' the whitespace is a unique character that will not be interpreted; it can be used to align your marble string.
      - '-' represents a frame of virtual time passing
      - '|' This sign illustrates the completion of an observable.
      - '#' Signifies an error
      - [a-z] an alphanumeric character represents a value which is emitted by the Observable.
      - '()' used to group events in the same frame. This can be used to group values, errors, and completion.
      - '^' this sign illustrates the subscription point and will only be used when we are dealing with hot observables.

  That’s the basic syntax. Let’s look at some examples to make ourself more familiar with the syntax.
      - --: equivalent to NEVER. An observable that never emits
      - a--b--c| : an Observable that emits a on the first frame, b on the fourth and c on the seventh. After emitting c the observable completes.
      - ab--# : An Observable that emits a on frame two, b on frame three and an error on frame six.
      - a^(bc)--|: A hot Observable that emits a before the subscription.
   */


  it('Should stream all challenges', (done) => {
    let mockResponse: Object = { challenge: 'challenge' }
    service.getAllChallenges().subscribe();
    const req = httpClientMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`);
    expect(req.request.method).toEqual("GET");
    req.flush(mockResponse);
    done()
  });

  it('should make GET request with correct parameters', () => {
    const mockResponse = { challenge: 'challenge' };
    const pageOffset = 0;
    const pageLimit = 8;

    service.getAllChallengesOffset(pageOffset, pageLimit).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpClientMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}?offset=${pageOffset}&limit=${pageLimit}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  it('should sort challenges by creation date in asscending order', () => {
    const mockChallenges = [
      { id: 1, creation_date: '2022-05-10' },
      { id: 2, creation_date: '2022-05-08' },
      { id: 3, creation_date: '2022-05-09' }
    ];
    const offset = 0;
    const limit = 3;

    const sortedChallengesObservable = service.orderBySortAscending('creation_date', mockChallenges, offset, limit);

    sortedChallengesObservable.subscribe((sortedChallenges: any) => {
      expect(sortedChallenges[0].creation_date).toBe('2022-05-08');
      expect(sortedChallenges[1].creation_date).toBe('2022-05-09');
      expect(sortedChallenges[2].creation_date).toBe('2022-05-10');
    });
  });

  it('should sort challenges by creation date in descending order', () => {
    const mockChallenges = [
      { id: 1, creation_date: '2022-05-10' },
      { id: 2, creation_date: '2022-05-08' },
      { id: 3, creation_date: '2022-05-09' }
    ];
    const offset = 0;
    const limit = 3;

    const sortedChallengesObservable = service.orderBySortAsDescending('creation_date', mockChallenges, offset, limit);

    sortedChallengesObservable.subscribe((sortedChallenges: any) => {
      expect(sortedChallenges[2].creation_date).toBe('2022-05-10');
      expect(sortedChallenges[1].creation_date).toBe('2022-05-09');
      expect(sortedChallenges[0].creation_date).toBe('2022-05-08');
    });
  });


  it('Should stream all challenges', () => {

    testScheduler.run(({ expectObservable }) => {

      const expectedMarble = '---(a|)';
      const expectedValues = { a: data };
      const obs$ = service.getAllChallenges().pipe(delay(3));

      expectObservable(obs$).toBe(expectedMarble, expectedValues);
    });
  });

});





