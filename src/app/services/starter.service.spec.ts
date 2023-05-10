import {StarterService} from "./starter.service";
import { hot, cold } from 'jasmine-marbles'
import {Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {TestScheduler} from "rxjs/internal/testing/TestScheduler";

describe('StarterService', () => {

    let starterService: StarterService;
    let httpClientSpy: any;
    let testScheduler: TestScheduler;

    beforeEach(() => {
        //mock httpClient
        httpClientSpy = jasmine.createSpy('httpClient');
        httpClientSpy.get = jasmine.createSpy('get').and.returnValue({
            a: 'Hans',
            b: 'Martin',
            c: 'Julia'
        });
        //inject spy
        starterService = new StarterService(httpClientSpy);

        //
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });

    });

    it('Should be created', () => {
        expect(starterService).toBeTruthy()
    })

    it('Should correctly return all challenges', () => {
        const expectedMarble = '(abc|)';
        const resultExpected = {
            a: 'pako',
            b: 'Martin',
            c: 'Julia',
        }

        const observable$ = of(resultExpected);
        //expect(starterService.getAllChallenges()).toStrictEqual({"a": "Hans", "b": "Martin", "c": "Julia"});
        // expect(starterService.getAllChallenges).toBe(resultExpected);
    })
});
