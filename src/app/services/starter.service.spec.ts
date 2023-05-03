import {StarterService} from "./starter.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {TestBed} from "@angular/core/testing";

describe('StarterService', () => {

    let service: StarterService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [ StarterService ]
        }).compileComponents();

        service = TestBed.inject(StarterService);
        httpMock = TestBed.inject(HttpTestingController);
    });


    it('Get All Challenges Test', done => {
        service.getAllChallenges().subscribe(res => {
            expect(res).toBeTruthy();
            done();
        });
    });

});




