import { TestBed, type ComponentFixture } from '@angular/core/testing'
import { StarterComponent } from './starter.component'
import { StarterService } from 'src/app/services/starter.service'
import { TranslateModule } from '@ngx-translate/core'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { environment } from 'src/environments/environment'
import { of } from 'rxjs'
import { type Challenge } from 'src/app/models/challenge.model'

describe('StarterComponent', () => {
  let component: StarterComponent
  let fixture: ComponentFixture<StarterComponent>
  let starterService: StarterService
  let httpClientMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [StarterComponent]
    })
    fixture = TestBed.createComponent(StarterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    starterService = TestBed.inject(StarterService)
    httpClientMock = TestBed.inject(HttpTestingController)
  })

  it('should call getAllChallengesOffset when sortBy empty', (done) => {
    const mockResponse: Challenge[] = [
      {
        id_challenge: '1',
        challenge_title: 'Challenge 1',
        level: 'EASY',
        popularity: 1,
        creation_date: new Date('2022-05-10'),
        detail: {
          description: 'lorem',
          examples: [],
          notes: 'lorem'
        },
        languages: [
          {
            id_language: '1',
            language_name: 'lorem'
          }
        ],
        solutions: [
          {
            idSolution: '1',
            solutionText: 'Aquí va el texto de la solución 1'
          }
        ]
      },
      {
        id_challenge: '2',
        challenge_title: 'Challenge 2',
        level: 'EASY',
        popularity: 1,
        creation_date: new Date('2022-05-10'),
        detail: {
          description: 'lorem',
          examples: [],
          notes: 'lorem'
        },
        languages: [
          {
            id_language: '2',
            language_name: 'lorem'
          }
        ],
        solutions: [
          {
            idSolution: '1',
            solutionText: 'Aquí va el texto de la solución 1'
          }
        ]
      },
      {
        id_challenge: '3',
        challenge_title: 'Challenge 1',
        level: 'EASY',
        popularity: 1,
        creation_date: new Date('2022-05-10'),
        detail: {
          description: 'lorem',
          examples: [],
          notes: 'lorem'
        },
        languages: [
          {
            id_language: '1',
            language_name: 'lorem'
          }
        ],
        solutions: [
          {
            idSolution: '1',
            solutionText: 'Aquí va el texto de la solución 1'
          }
        ]
      }
    ]
    const starterServiceSpy = jest.spyOn(starterService, 'getAllChallengesOffset').mockReturnValue(of(mockResponse))
    component.sortBy = ''

    component.getChallengesByPage(1)

    const req = httpClientMock.expectOne(req => {
      // Comprueba que la URL es la correcta
      return req.url === `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}` && req.params.get('offset') === '0' && req.params.get('limit') === '8'
    })
    expect(req.request.method).toEqual('GET')

    expect(starterServiceSpy).toBeCalledWith(0, 8)
    expect(component.listChallenges).toBe(mockResponse)
    expect(component.totalPages).toEqual(3)

    req.flush(mockResponse)
    httpClientMock.match(req => {
      console.log(req.url)
      return false
    })
    httpClientMock.verify()
    done()
  })
})

// it('should create', () => {
//   expect(component).toBeTruthy()
// })

// it('should call getAllChallenges when sortBy is not empty', (done) => {
//   const mockResponse = { challenge: 'challenge' }
//   component.sortBy = 'creation_date'
//   spyOn(starterService, 'getAllChallenges').and.returnValue(of(mockResponse))

//   component.getChallengesByPage(1)
//   expect(starterService.getAllChallenges).toHaveBeenCalled()
//   done()
// })

// it('should set listChallenges correctly when sortBy is empty', () => {
//   const mockResponse = { challenge: 'challenge' }
//   spyOn(starterService, 'getAllChallengesOffset').and.returnValue(of(mockResponse))
//   component.sortBy = ''
//   component.getChallengesByPage(1)
//   expect(component.listChallenges).toBe(mockResponse)
// })

// it('should set listChallenges correctly when sortBy is not empty', () => {
//   const mockResponse = [{ challenge: 'challenge' }]
//   spyOn(starterService, 'getAllChallenges').and.returnValue(of(mockResponse))
//   spyOn(starterService, 'orderBySortAscending').and.returnValue(of(mockResponse))
//   component.sortBy = 'creation_date'
//   component.getChallengesByPage(1)
//   expect(component.listChallenges).toStrictEqual(mockResponse)
// })

// // changeSort
// it('should set isAscending to false and selectedSort equal to newSort', () => {
//   const newSort = 'creation_date'
//   const selectedSort = 'creation_date'
//   const pageNumber = 1

//   const getChallengesByPageSpy = jest.spyOn(component, 'getChallengesByPage')
//   component.changeSort(newSort)
//   spyOn(component, 'getChallengesByPage')

//   expect(component.isAscending).toBeTruthy()
//   expect(selectedSort).toEqual(newSort)
//   expect(getChallengesByPageSpy).toHaveBeenCalledWith(pageNumber)
//   expect(component.isAscending).toBeTruthy()
// })

// it('should set isAscending to true after setting it to false', () => {
//   const newSort = 'creation_date'
//   component.changeSort(newSort)

//   expect(component.isAscending).toBeTruthy()
// })

// it('should not call getChallengesByPage if newSort is not "popularity" or "creation_date"', () => {
//   const newSort = ''
//   component.changeSort(newSort)
//   const getChallengesByPageSpy = jest.spyOn(component, 'getChallengesByPage')

//   expect(getChallengesByPageSpy).not.toHaveBeenCalled()
// })

// it('should call getChallengesByPage function when all filter arrays are empty', () => {
//   const pageNumber = 1
//   const getChallengesByPageSpy = jest.spyOn(component, 'getChallengesByPage')

//   component.getChallengeFilters({ languages: [], levels: [], progress: [] })

//   expect(getChallengesByPageSpy).toHaveBeenCalledWith(pageNumber)
// })

// it('should handle filters when languages array is not empty', () => {
//   const mockFilteredResp = ['filteredChallenge1', 'filteredChallenge2'] // Mock de la respuesta filtrada
//   const getChallengeFiltersSpy = jest.spyOn(component, 'getChallengeFilters')

//   spyOn(starterService, 'getAllChallengesFiltered').and.returnValue(of(mockFilteredResp))

//   component.getChallengeFilters({ languages: ['JavaScript'], levels: ['Easy'], progress: [] })

//   expect(getChallengeFiltersSpy).toHaveBeenCalled()
// })
