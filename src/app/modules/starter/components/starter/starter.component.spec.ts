import { TestBed, type ComponentFixture } from '@angular/core/testing'

import { StarterComponent } from "./starter.component"
import { StarterService } from 'src/app/services/starter.service'
import { TranslateModule, TranslateParser, TranslateService } from '@ngx-translate/core'
import { HttpClient, HttpClientModule } from '@angular/common/http'
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

  it('should receive filter values from child component when it emits', () => {
    // TODO revise this test
    // const spy = spyOn(component, 'getChallengeFilters').and.callThrough();
    // const expectedFilters: FilterChallenge = {
    //   languages: [1],
    //   levels: ['easy'],
    //   progress: [1]
    // };

    // childComponent.filtersSelected.emit(expectedFilters);

    // expect(spy).toHaveBeenCalled();
    // expect(spy).toHaveBeenCalledWith(expectedFilters);
  })

  it('should receive filter values from child component when languagesForm changes', () => {
  // TODO revise this test
  // spyOn(component, 'getChallengeFilters').and.callThrough();

    // childComponent.filtersForm.controls['languages'].setValue({javascript: true, java:false, php: false, python: false});

    // fixture.detectChanges();

  // expect(component.getChallengeFilters).toHaveBeenCalled();
  // expect(component.filters.languages).toContain(1);
  })

  it('should receive filter values from child component when levelsForm changes', () => {
  // TODO revise this test
  // spyOn(component, 'getChallengeFilters').and.callThrough();

    // childComponent.filtersForm.controls['levels'].setValue({easy: true, medium: false, hard: false});

    // fixture.detectChanges();

  // expect(component.getChallengeFilters).toHaveBeenCalled();
  // expect(component.filters.levels).toContain('easy');
  })

  it('should receive filter values from child component when progressForm changes', () => {
  // TODO revise this test
  // spyOn(component, 'getChallengeFilters').and.callThrough();

    // childComponent.filtersForm.controls['progress'].setValue({noStarted: true, started:false, finished: false});

    // fixture.detectChanges();

  // expect(component.getChallengeFilters).toHaveBeenCalled();
  // expect(component.filters.progress).toContain(1);
  })

  it('should receive all filter values from child component', () => {
  // TODO revise this test
  // const spy = spyOn(component, 'getChallengeFilters').and.callThrough();
  // const expectedFilters: FilterChallenge = {
  //   languages: [1],
  //   levels: ['easy'],
  //   progress: [1]
  // };

    // childComponent.filtersForm.get('languages')!.get('javascript')!.setValue(true);
    // childComponent.filtersForm.get('levels')!.get('easy')!.setValue(true);
    // childComponent.filtersForm.get('progress')!.get('noStarted')!.setValue(true);

  // fixture.whenStable().then(() => {
  //   expect(spy).toHaveBeenCalled();
  //   expect(spy).toHaveBeenCalledWith(expectedFilters);
  //   expect(component.filters).toEqual(expectedFilters);
  // });
  })
})
