import {StarterService} from "./starter.service";
import { hot, cold } from 'jasmine-marbles'
import {Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {TestScheduler} from "rxjs/internal/testing/TestScheduler";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {TestBed} from "@angular/core/testing";

describe('StarterService', () => {

    let starterService: StarterService;
    let httpMock: HttpTestingController;
    let scheduler: TestScheduler;
    let httpClientSpy: any;

    beforeEach(() => scheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);

    });
        httpClientSpy = jasmine.createSpy('httpClient');
        httpClientSpy.get = jasmine.createSpy('get').and.returnValue(of('pizza', 'burger', 'hotdog'));
        //inject spy
        starterService = new StarterService(httpClientSpy);



    );

    it('Should be created', () => {
        expect(starterService).toBeTruthy()
    })


/*    it('Should stream all challenges', () => {

        scheduler.run(({expectObservable}) => {

            const expectedMarble = '(abc|)';
            const expectedValues = {a: 'pizza', b: 'burger', c: 'hotdog'};

            //pte inyectar observable
             //const food$ = of('pizza', 'burger', 'hotdog');
            const food$ = service.getAllChallenges()

            expectObservable(food$).toBe(expectedMarble, expectedValues);
        });

    });*/


});





