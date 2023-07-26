import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChallengeService } from './challenge.service';
import {TestScheduler} from "rxjs/internal/testing/TestScheduler";
import {delay, of} from "rxjs";
import data from "../../assets/dummy/challenge.json"; 

describe('ChallengeService', () => {
  let service: ChallengeService;
  let serviceInjected: ChallengeService;
  let httpMock: HttpTestingController;
  let scheduler: TestScheduler;
  let httpClientSpy: any;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChallengeService]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClientSpy = jasmine.createSpy('httpClient');
    httpClientSpy.get = jasmine.createSpy('get').and.returnValue(of(data));
    service = new ChallengeService(httpClientSpy);
    serviceInjected = TestBed.inject(ChallengeService);
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch challenge by id', () => {
    const dummyChallenge = { id_challenge: '1adfadf21fasdf2-adf', challenge_title: 'Sociis Industries' };

    serviceInjected.getChallengeById('1adfadf21fasdf2-adf').subscribe(res => {
      expect(res).toEqual(dummyChallenge);
    });

    const req = httpMock.expectOne('../assets/dummy/challenge.json');
    expect(req.request.method).toBe('GET');
    req.flush(dummyChallenge);
  });

    it('Should stream a challenge', () => {

      testScheduler.run(({expectObservable}) => {
          const idChallenge = "1adfadf21fasdf2-adf" 
          const expectedMarble = '---(a|)';
          const expectedValues = {a: data};
          const obs$ = service.getChallengeById(idChallenge).pipe(delay(3));

          expectObservable(obs$).toBe(expectedMarble, expectedValues);
      });

  });

});


// /* Observable Test, see https://docs.angular.lat/guide/testing-components-scenarios */
// describe('ChallengeService', () => {

    

//     beforeEach(() => {

//         //inject spy

//         service = new ChallengeService(httpClientSpy);

//     });


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



// });








