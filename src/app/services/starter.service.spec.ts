import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StarterService } from './starter.service';
import dataDummy from "./../../assets/dummy/data-challenge.json";
import { environment } from '../../environments/environment';


describe('StarterService', () => {
  let service: StarterService;
  let httpMock: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StarterService]
    });


    service = TestBed.inject(StarterService);
    httpMock = TestBed.inject(HttpTestingController);
  });


  afterEach(() => {
    httpMock.verify(); // Make sure that there are no outstanding requests.
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


    it('should get all challenges', () => {
        const page = 1;
        const pageSize = environment.pageSize;
        const dummyData: any = [dataDummy.results];


    service.getAllChallenges(page, pageSize).subscribe(data => {
      expect(data).toEqual(dummyData);
      console.log(dummyData);
    });


    const req = httpMock.expectOne(`../assets/dummy/data-challenge.json?page=${page}&pageSize=${pageSize}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });
});






