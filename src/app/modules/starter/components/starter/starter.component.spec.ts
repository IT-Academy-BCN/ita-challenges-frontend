import { TestBed, type ComponentFixture } from '@angular/core/testing'

import { StarterComponent } from './starter.component'
import { StarterService } from 'src/app/services/starter.service'
import { TranslateModule } from '@ngx-translate/core'
import { type Challenge } from 'src/app/models/challenge.model'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { of, BehaviorSubject } from 'rxjs'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import mockChallenges from 'src/mocks/challenge/challenge.mock.json'
import { AuthService } from 'src/app/services/auth.service'

describe('StarterComponent', () => {
  let component: StarterComponent
  let fixture: ComponentFixture<StarterComponent>
  let starterService: StarterService
  let authService: AuthService
  let authRoleSubject: BehaviorSubject<string>

  const mockChallenges$: Challenge[] = mockChallenges.map((challenge: any) => ({
    ...challenge,
    creation_date: new Date(`${challenge.creation_date}`),
    timesFavorite: typeof challenge.timesFavorite === 'number' ? challenge.timesFavorite : 0,
    solutions: challenge.solutions.map((solution: any) => ({
      id_solution: solution.idSolution,
      solution_text: solution.solutionText
    }))
  }))

  beforeEach(() => {
    // Create a mock AuthService with a BehaviorSubject we can control
    authRoleSubject = new BehaviorSubject<string>('')
    const authServiceMock = {
      getUserRole: () => authRoleSubject.asObservable(),
      updateUserRoleAndUserNameFromToken: () => {}
    }

    TestBed.configureTestingModule({
      declarations: [StarterComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        StarterService,
        { provide: AuthService, useValue: authServiceMock },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    })
    fixture = TestBed.createComponent(StarterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    starterService = TestBed.inject(StarterService)
    authService = TestBed.inject(AuthService)

    component.listChallenges = []
    component.filters = { languages: [], levels: [], progress: [] }
    component.sortBy = ''
  })

  it('should assign all challenges when listChallenges is populated.', () => {
    component.listChallenges = mockChallenges$
    component.filters = { languages: [], levels: [], progress: [] }
    component.getChallengeFilters(component.filters)
    expect(component.challenges.length).toBe(mockChallenges$.length) // Debe mostrar 3 desafíos
    expect(component.challenges).toEqual(mockChallenges$) // Verifica que los desafíos sean correctos
  })

  it('should filter challenges and update challenges correctly', () => {
    // Simular la lista de desafíos
    component.listChallenges = mockChallenges$

    const filters = { languages: ['es'], levels: ['EASY'], progress: [] }
    const filteredChallenges = mockChallenges$.slice(0, 3)

    // Simular el servicio para que devuelva desafíos filtrados
    spyOn(starterService, 'getAllChallengesFiltered').and.returnValue(of(filteredChallenges)) // Solo retorna los primeros

    component.getChallengeFilters(filters)

    expect(component.filters).toEqual(filters) // Verifica que los filtros se hayan establecido correctamente
    expect(starterService.getAllChallengesFiltered).toHaveBeenCalledWith(filters, mockChallenges$) // Verifica que el método se haya llamado con los argumentos correctos
    expect(component.challenges).toEqual(filteredChallenges)
  })

  it('should change the sorting criterion and update isAscending and selectedSort correctly.', () => {
    component.selectedSort = 'creation_date'
    component.isAscending = true
    spyOn(component, 'refreshChallengeList')

    // Cambia a un nuevo criterio de ordenación que no sea el actual
    component.changeSort('popularity')

    expect(component.selectedSort).toBe('popularity')
    expect(component.isAscending).toBe(true)
    expect(component.refreshChallengeList).toHaveBeenCalled()

    // Cambia de nuevo al criterio de ordenación actual para verificar el cambio en isAscending
    component.changeSort('popularity')
    expect(component.isAscending).toBe(false)
    expect(component.refreshChallengeList).toHaveBeenCalledTimes(2)
  })

  it('should update isAdmin flag when user role changes to ADMIN', () => {
    expect(component.isAdmin).toBe(false)

    authRoleSubject.next('ADMIN')
    expect(component.isAdmin).toBe(true)
  })

  it('should update isAdmin flag when user role changes to non-ADMIN', () => {
    authRoleSubject.next('ADMIN')
    expect(component.isAdmin).toBe(true)

    authRoleSubject.next('USER')

    expect(component.isAdmin).toBe(false)
  })

  it('should unsubscribe from userRoleSubs$ on component destruction', () => {
    spyOn(component.userRoleSubs$, 'unsubscribe')

    // Trigger the component's ngOnDestroy lifecycle hook to clean up subscriptions
    component.ngOnDestroy()

    expect(component.userRoleSubs$.unsubscribe).toHaveBeenCalled()
  })
})
