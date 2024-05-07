import { TestBed, type ComponentFixture } from '@angular/core/testing'

import { StarterComponent } from './starter.component'
import { StarterService } from 'src/app/services/starter.service'
import { TranslateModule } from '@ngx-translate/core'

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { environment } from 'src/environments/environment'
import { of } from 'rxjs'

describe('StarterComponent', () => {
  let component: StarterComponent
  let fixture: ComponentFixture<StarterComponent>
  let starterService: StarterService
  let httpClientMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [StarterComponent],
    })
    fixture = TestBed.createComponent(StarterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    starterService = TestBed.inject(StarterService)
    httpClientMock = TestBed.inject(HttpTestingController)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should get challenges by page', (done) => {
    const mockResponse = { challenge: 'challenge' }
    const starterServiceSpy = jest.spyOn(starterService, 'getAllChallenges').mockReturnValue(of(mockResponse))

    component.getChallengesByPage(1)
    const req = httpClientMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}?offset=0&limit=8`)
    expect(req.request.method).toEqual('GET')

    expect(starterServiceSpy).toBeCalledWith(0, 8)
    expect(component.listChallenges).toBe(mockResponse)
    expect(component.totalPages).toEqual(3)

    req.flush(mockResponse)
    done()
  })

  it('should set isAscending to false and selectedSort equal to newSort', () => {
    const newSort = 'creation_date';
    const selectedSort = 'creation_date'
    const pageNumber = 1;

    const getChallengesByPageSpy = jest.spyOn(component, 'getChallengesByPage')
    component.changeSort(newSort);
    spyOn(component, 'getChallengesByPage');

    expect(component.isAscending).toBeTruthy();
    expect(selectedSort).toEqual(newSort);
    expect(getChallengesByPageSpy).toHaveBeenCalledWith(pageNumber);
    expect(component.isAscending).toBeTruthy();
  });

  it('should set isAscending to true after setting it to false', () => {
    const newSort = 'creation_date';
    component.changeSort(newSort);

    expect(component.isAscending).toBeTruthy();
  });

  it('should not call getChallengesByPage if newSort is not "popularity" or "creation_date"', () => {
    const newSort = '';
    component.changeSort(newSort);
    const getChallengesByPageSpy = jest.spyOn(component, 'getChallengesByPage')

    expect(getChallengesByPageSpy).not.toHaveBeenCalled();
  });
})
