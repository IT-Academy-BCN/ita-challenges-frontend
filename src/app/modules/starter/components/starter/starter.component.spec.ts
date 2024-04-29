import { TestBed, type ComponentFixture } from '@angular/core/testing'

import { StarterComponent } from "./starter.component"
import { StarterService } from 'src/app/services/starter.service'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { environment } from 'src/environments/environment'
import { of } from 'rxjs'

describe('StarterComponent', () => {
  let component: StarterComponent
  let fixture: ComponentFixture<StarterComponent>
  let starterService: StarterService;
  let translateService: TranslateService;
  let httpClient: HttpClient;
	let httpClientMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(),],
      declarations: [StarterComponent]
    })
    fixture = TestBed.createComponent(StarterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    starterService = TestBed.inject(StarterService)
    translateService = TestBed.inject(TranslateService)
    httpClient = TestBed.inject(HttpClient)
    httpClientMock = TestBed.inject(HttpTestingController)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should get challenges by page', (done) => {
    let mockResponse: Object = {challenge: 'challenge'}
    let starterServiceSpy = jest.spyOn(starterService, 'getAllChallenges').mockReturnValue(of(mockResponse));

    component.getChallengesByPage(1)
    const req = httpClientMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}?offset=0&limit=8`);
    expect(req.request.method).toEqual("GET");

    expect(starterServiceSpy).toBeCalledWith(0,8)
    expect(component.listChallenges).toBe(mockResponse)
    expect(component.totalPages).toEqual(3)

    req.flush(mockResponse);
    done();   
  })
})
