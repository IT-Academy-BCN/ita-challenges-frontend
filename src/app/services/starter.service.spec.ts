import {StarterService} from "./starter.service";
import { hot, cold } from 'jasmine-marbles'

describe('StarterService', () => {


    let starterService: StarterService;
    let httpClientSpy: any;

    beforeEach(() => {


        //mock httpClient
        httpClientSpy = jasmine.createSpy('httpClient');
        httpClientSpy.get = jasmine.createSpy('get').and.returnValue('../assets/dummy/data-challenge.json');
        //inject spy
        starterService = new StarterService(httpClientSpy);
    });

    it('Should be created', () => {
        expect(starterService).toBeTruthy()
    })

    it('should correctly return mighty users (using jasmine-marbles)', () => {

        // Here we define the Observable we expect to be returned by "getModifiedUsers"
        const expectedObservable = cold('--a-b-c', {
            a: 'Mighty Hans',
            b: 'Mighty Martin',
            c: 'Mighty Julia',
        })
        expect(starterService.getAllChallenges()).toBe('../assets/dummy/data-challenge.json');
    })





});


