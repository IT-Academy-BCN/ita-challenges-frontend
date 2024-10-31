import { TestBed, type ComponentFixture } from '@angular/core/testing'

import { StarterComponent } from './starter.component'
import { StarterService } from 'src/app/services/starter.service'
import { TranslateModule } from '@ngx-translate/core'

import { provideHttpClientTesting } from '@angular/common/http/testing'
import { of } from 'rxjs'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

describe('StarterComponent', () => {
  let component: StarterComponent
  let fixture: ComponentFixture<StarterComponent>
  let starterService: StarterService

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StarterComponent],
      imports: [TranslateModule.forRoot()],
      providers: [StarterService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    fixture = TestBed.createComponent(StarterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    starterService = TestBed.inject(StarterService)

    component.listChallenges = []
    component.pageSize = 1
    component.filters = { languages: [], levels: [], progress: [] }
    component.sortBy = ''
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should assign challenges when challenges are available.', () => {
    const mockChallenges = Array.from({ length: 12 }, (_, i) => ({
      id_challenge: `challenge-${i}`,
      challenge_title: { es: 'Desafío ' + (i + 1) },
      creation_date: '2022-01-01',
      detail: { description: {}, examples: [], notes: {} },
      level: 'EASY',
      languages: [{ code: 'es', name: 'Spanish' }]
    }))

    component.listChallenges = mockChallenges
    component.pageSize = 8
    component.filters = { languages: [], levels: [], progress: [] }
    component.getChallengesByPage(1)

    expect(component.challenges.length).toBe(8) // Debe mostrar 8 desafíos
    expect(component.challenges).toEqual(mockChallenges.slice(0, 8)) // Verifica que los desafíos sean correctos
  })

  it('should sort and set listChallenges correctly based on the state of isAscending', () => {
    const mockChallenges = [
      { id_challenge: '1', challenge_title: { es: 'Desafío 1' }, level: 'EASY' },
      { id_challenge: '2', challenge_title: { es: 'Desafío 2' }, level: 'HARD' },
      { id_challenge: '3', challenge_title: { es: 'Desafío 3' }, level: 'MEDIUM' }
    ]

    // Simulando el servicio para que devuelva desafíos no ordenados
    spyOn(starterService, 'orderBySortAscending').and.returnValue(of(mockChallenges))
    spyOn(starterService, 'orderBySortAsDescending').and.returnValue(of(mockChallenges))

    // Prueba para orden ascendente
    component.isAscending = true
    component.sortBy = 'creation_date'
    component.getAndSortChallenges(0, mockChallenges)

    expect(component.listChallenges).toEqual(mockChallenges)
    expect(component.challenges).toEqual(mockChallenges.slice(0, component.pageSize))

    // Prueba para orden descendente
    component.isAscending = false
    component.getAndSortChallenges(0, mockChallenges)

    expect(component.listChallenges).toEqual(mockChallenges)
    expect(component.challenges).toEqual(mockChallenges.slice(0, component.pageSize))
  })

  it('should filter challenges and update challenges correctly', () => {
    const mockChallenges = Array.from({ length: 12 }, (_, i) => ({
      id_challenge: `challenge-${i}`,
      challenge_title: { es: 'Desafío ' + (i + 1) },
      creation_date: '2022-01-01',
      detail: { description: {}, examples: [], notes: {} },
      level: 'EASY',
      languages: [{ code: 'es', name: 'Spanish' }]
    }))

    // Simular la lista de desafíos
    component.listChallenges = mockChallenges

    const filters = { languages: ['es'], levels: ['EASY'], progress: [] }
    // Simular el servicio para que devuelva desafíos filtrados
    spyOn(starterService, 'getAllChallengesFiltered').and.returnValue(of(mockChallenges.slice(0, 8))) // Solo retorna los primeros

    component.getChallengeFilters(filters)

    expect(component.filters).toEqual(filters) // Verifica que los filtros se hayan establecido correctamente
    expect(starterService.getAllChallengesFiltered).toHaveBeenCalledWith(filters, mockChallenges) // Verifica que el método se haya llamado con los argumentos correctos
    expect(component.paginationFilters.length).toBe(8) // Verifica que la longitud de los desafíos filtrados sea correcta

    const expectedTotalPages = Math.ceil(component.paginationFilters.length / component.pageSize)
    expect(component.totalPages).toBe(expectedTotalPages) // Verifica que el total de páginas se haya calculado correctamente

    // Asegúrate de que los desafíos se establezcan correctamente según la ventana
    if (window.innerWidth < 768) {
      expect(component.challenges).toEqual(component.paginationFilters) // En móviles, debe mostrar todos los filtrados
    } else {
      const startIndex = (component.pageNumber - 1) * component.pageSize
      expect(component.challenges).toEqual(component.paginationFilters.slice(startIndex, startIndex + component.pageSize)) // En escritorio, paginados
    }
  })

  it('should change the sorting criterion and update isAscending and selectedSort correctly.', () => {
    component.selectedSort = 'creation_date'
    component.isAscending = true
    component.pageNumber = 1

    spyOn(component, 'getChallengesByPage')

    // Cambia a un nuevo criterio de ordenación que no sea el actual
    component.changeSort('popularity')

    expect(component.selectedSort).toBe('popularity')
    expect(component.isAscending).toBe(true)
    expect(component.getChallengesByPage).toHaveBeenCalledWith(1)

    // Cambia de nuevo al criterio de ordenación actual para verificar el cambio en isAscending
    component.changeSort('popularity')
    expect(component.isAscending).toBe(false)

    expect(component.getChallengesByPage).toHaveBeenCalledTimes(2)
  })
})
