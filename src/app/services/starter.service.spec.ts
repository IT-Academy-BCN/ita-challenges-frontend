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
        httpClientSpy = jasmine.createSpy('httpClient');

        //OJO retorna string, NO un observable
        httpClientSpy.get = jasmine.createSpy('get').and.returnValue({
            a: 'Spiderman',
            b: 'Thor',
            c: 'Lobezno'
        });
        //inject spy
        starterService = new StarterService(httpClientSpy);
    });

    it('Should be created', () => {
        expect(starterService).toBeTruthy()
    })

    it('Should correctly return all challenges', () => {
        const resultExpected = {
            a: 'Spiderman',
            b: 'Thor',
            c: 'Lobezno',
        }
        //comparacion de strings
        expect(starterService.getAllChallenges()).toStrictEqual(resultExpected);
    })
});
