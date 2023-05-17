import {StarterService} from "./starter.service";
import { hot, cold } from 'jasmine-marbles'
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {TestScheduler} from "rxjs/internal/testing/TestScheduler";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {TestBed} from "@angular/core/testing";
import {of} from "rxjs";
import data from "./../../assets/dummy/data-challenge.json"; //see data-typings.d.ts


/* Observable Test */
describe('StarterService', () => {

    let service: StarterService;
    let httpMock: HttpTestingController;
    let scheduler: TestScheduler;
    let httpClientSpy: any;
    let testScheduler: TestScheduler;

    beforeEach(() => {

        //inject spy - TODO load data from json file
        httpClientSpy = jasmine.createSpy('httpClient');
        httpClientSpy.get = jasmine.createSpy('get').and.returnValue(of('pizza', 'burger', 'hotdog'));
        service = new StarterService(httpClientSpy);
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);

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

    it('Should stream all challenges', () => {

        testScheduler.run(({expectObservable}) => {

            const expectedMarble = '(abc|)';
            const expectedValues = {a: 'pizza', b: 'burger', c: 'hotdog'};
            const obs$ = service.getAllChallenges();

            //contains dummy data - TODO use json file
            console.log(data);
            expectObservable(obs$).toBe(expectedMarble, expectedValues);
        });

    });

});





