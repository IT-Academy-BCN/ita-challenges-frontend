import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { FiltersModalComponent } from './filters-modal.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ChallengeService } from 'src/app/services/challenge.service'
import { of } from 'rxjs'

describe('FiltersModalComponent', () => {
  let component: FiltersModalComponent
  let fixture: ComponentFixture<FiltersModalComponent>
  let mockChallengeService: { getAllLanguages: any }

  beforeEach(async () => {
    mockChallengeService = {
      getAllLanguages: () => of({ results: [] })
    }

    await TestBed.configureTestingModule({
      declarations: [FiltersModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ChallengeService, useValue: mockChallengeService },
        { provide: NgbModal, useValue: { open: () => ({}) } }
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should emit filtersSelected event with correct filters', () => {
    // Datos simulados para el servicio
    const mockLanguages = [
      { id_language: '1', language_name: 'JavaScript' },
      { id_language: '2', language_name: 'Python' }
    ]
    mockChallengeService.getAllLanguages = () => of({ results: mockLanguages })

    // Espiar el EventEmitter
    spyOn(component.filtersSelected, 'emit')

    // Establecer valores del formulario
    component.formGroup.setValue({
      languages: { javascript: true, java: false, php: false, python: false },
      levels: { easy: true, medium: false, hard: false },
      progress: { noStarted: false, started: false, finished: false }
    })

    // Aplicar filtros
    component.applyFilters()
    fixture.detectChanges()

    // Valores de filtro esperados
    const expectedFilter = {
      languages: ['1'], // ID de JavaScript
      levels: ['EASY'],
      progress: []
    }

    // Verificar si el evento fue emitido con los valores correctos
    expect(component.filtersSelected.emit).toHaveBeenCalledWith(expectedFilter)
  })
})
