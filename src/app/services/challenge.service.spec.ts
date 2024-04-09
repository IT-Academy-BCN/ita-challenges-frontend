import { ChallengeService } from './challenge.service'
import { TestScheduler } from 'rxjs/internal/testing/TestScheduler'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { delay, of } from 'rxjs'
import data from '../../assets/dummy/challenge.json'
import { HttpClient } from '@angular/common/http'
import { TestBed } from '@angular/core/testing'
import { environment } from 'src/environments/environment'
import { type Itinerary } from '../models/itinerary.interface'

/* Observable Test, see https://docs.angular.lat/guide/testing-components-scenarios */
describe('ChallengeService', () => {
  let service: ChallengeService
  let httpMock: HttpTestingController
  let scheduler: TestScheduler
  let httpClient: HttpClient
  let httpClientMock: HttpTestingController
  let httpClientSpy: any
  let testScheduler: TestScheduler

  beforeEach(() => {
    TestBed.configureTestingModule({ // set up the testing module with required dependencies.
      imports: [HttpClientTestingModule]
    })

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient) // TestBed.inject is used to inject into the test suite
    httpClientMock = TestBed.inject(HttpTestingController)

    // inject spy
    httpClientSpy = jasmine.createSpy('httpClient')
    httpClientSpy.get = jasmine.createSpy('get').and.returnValue(of(data))
    service = new ChallengeService(httpClientSpy)
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected)
    })
  })

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

  it('Should stream a challenge', () => {
    testScheduler.run(({ expectObservable }) => {
      const idChallenge = '1adfadf21fasdf2-adf'
      const expectedMarble = '---(a|)'
      const expectedValues = { a: data }
      const obs$ = service.getChallengeById(idChallenge).pipe(delay(3))

      expectObservable(obs$).toBe(expectedMarble, expectedValues)
    })
  })

  it('should be created itineraries.service', (done) => {
    expect(service).toBeTruthy()
    done()
  })

  it('should get itineraries succesfully', (done) => {
    const mockData: Itinerary[] = [
      {
        id: '1',
        name: 'mockName',
        slug: 'mockSlug'
      }
    ]

    httpClient.get<Itinerary[]>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_ITINERARIES)).subscribe((res) => {
      expect(res).toEqual(mockData)
      done()
    })

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_ITINERARIES))
    expect(req.request.method).toEqual('GET')
    req.flush(mockData)
  })

  it('should handle error when getting itineraries', (done) => {
    httpClient.get<Itinerary[]>(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_ITINERARIES)).subscribe({
      next: () => {
        done.fail('Expected error but received next')
      },
      error: (err) => {
        expect(err).toBeTruthy()
        done()
      }
    })

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_ITINERARIES))
    expect(req.request.method).toEqual('GET')

    req.error(new ProgressEvent('error', {
      lengthComputable: false,
      loaded: 0,
      total: 0
    }))

    httpClientMock.verify()
  })
})
