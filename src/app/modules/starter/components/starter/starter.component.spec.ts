import { TestBed, type ComponentFixture } from '@angular/core/testing'

import { StarterComponent } from './starter.component'
import { StarterService } from 'src/app/services/starter.service'
import { TranslateModule } from '@ngx-translate/core'

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { of } from 'rxjs'
import { environment } from 'src/environments/environment'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

describe('StarterComponent', () => {
  let component: StarterComponent
  let fixture: ComponentFixture<StarterComponent>
  let starterService: StarterService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StarterComponent],
      imports: [TranslateModule.forRoot()],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    fixture = TestBed.createComponent(StarterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    starterService = TestBed.inject(StarterService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should call getAllChallenges when sortBy is not empty', (done) => {
    const mockResponse = { results: [{ challenge: 'challenge' }] }
    component.sortBy = 'creation_date'
    spyOn(starterService, 'getAllChallenges').and.returnValue(of(mockResponse))

    component.getChallengesByPage(1)
    expect(starterService.getAllChallenges).toHaveBeenCalled()
    done()
  })

  it('should set listChallenges correctly when sortBy is empty', () => {
    const mockResponse = { results: [{ challenge: 'challenge' }] }
    spyOn(starterService, 'getAllChallengesOffset').and.returnValue(of(mockResponse))
    component.sortBy = ''
    component.getChallengesByPage(1)
    expect(component.listChallenges).toBe(mockResponse.results)
  })

  it('should set listChallenges correctly when sortBy is not empty', () => {
    const mockResponse = { results: [{ challenge: 'challenge' }] }
    spyOn(starterService, 'getAllChallenges').and.returnValue(of(mockResponse))
    spyOn(starterService, 'orderBySortAscending').and.returnValue(of(mockResponse))
    component.sortBy = 'creation_date'
    component.getChallengesByPage(1)
    expect(component.listChallenges).toStrictEqual(mockResponse.results)
  })

  // changeSort
  it('should set isAscending to false and selectedSort equal to newSort', () => {
    const newSort = 'creation_date'
    const selectedSort = 'creation_date'
    const pageNumber = 1

    const getChallengesByPageSpy = jest.spyOn(component, 'getChallengesByPage')
    component.changeSort(newSort)
    spyOn(component, 'getChallengesByPage')

    expect(component.isAscending).toBeTruthy()
    expect(selectedSort).toEqual(newSort)
    expect(getChallengesByPageSpy).toHaveBeenCalledWith(pageNumber)
    expect(component.isAscending).toBeTruthy()
  })

  it('should set isAscending to true after setting it to false', () => {
    const newSort = 'creation_date'
    component.changeSort(newSort)

    expect(component.isAscending).toBeTruthy()
  })

  it('should not call getChallengesByPage if newSort is not "popularity" or "creation_date"', () => {
    const newSort = ''
    component.changeSort(newSort)
    const getChallengesByPageSpy = jest.spyOn(component, 'getChallengesByPage')

    expect(getChallengesByPageSpy).not.toHaveBeenCalled()
  })

  it('should call getChallengesByPage function when all filter arrays are empty', () => {
    const pageNumber = 1
    const getChallengesByPageSpy = jest.spyOn(component, 'getChallengesByPage')

    component.getChallengeFilters({ languages: [], levels: [], progress: [] })

    expect(getChallengesByPageSpy).toHaveBeenCalledWith(pageNumber)
  })

  it('should handle filters when languages array is not empty', () => {
    const mockFilteredResp = ['filteredChallenge1', 'filteredChallenge2'] // Mock de la respuesta filtrada
    const getChallengeFiltersSpy = jest.spyOn(component, 'getChallengeFilters')

    spyOn(starterService, 'getAllChallengesFiltered').and.returnValue(of(mockFilteredResp))

    component.getChallengeFilters({ languages: ['JavaScript'], levels: ['Easy'], progress: [] })

    expect(getChallengeFiltersSpy).toHaveBeenCalled()
  })

  it('should call getAllChallengesOffset with correct parameters', () => {
    const mockChallenges = [{ id: 1, name: 'Test Challenge' }]
    const pageOffset = 0
    const pageLimit = 10

    starterService.getAllChallengesOffset(pageOffset, pageLimit).subscribe((challenges: any) => {
      expect(challenges).toEqual(mockChallenges)
    })

    const req = httpMock.expectOne(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}?offset=${pageOffset}&limit=${pageLimit}`)
    expect(req.request.method).toBe('GET')
    req.flush(mockChallenges)
  })
})
