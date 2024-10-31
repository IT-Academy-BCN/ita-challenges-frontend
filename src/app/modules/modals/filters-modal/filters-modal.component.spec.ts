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
  let mockModalService: { open: any, dismissAll: any }

  beforeEach(async () => {
    mockChallengeService = {
      getAllLanguages: () => of(
        { results: [{ id_language: '1', language_name: 'JavaScript' }, { id_language: '2', language_name: 'Python' }] })
    }

    mockModalService = {
      open: jasmine.createSpy('open'),
      dismissAll: jasmine.createSpy('dismissAll')
    }

    await TestBed.configureTestingModule({
      declarations: [FiltersModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ChallengeService, useValue: mockChallengeService },
        { provide: NgbModal, useValue: mockModalService }
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

  it('should process filters correctly when applyFilters is called', () => {
    spyOn(component.filtersSelected, 'emit')

    // Simula que se llama a applyFilters, y que la API retorna lenguajes
    component.applyFilters()
    fixture.detectChanges()

    // Verifica que los lenguajes se cargaron correctamente
    expect(component.languages).toEqual({
      javascript: '1',
      python: '2'
    })

    // Simula valores en el formulario
    component.formGroup.setValue({
      languages: { javascript: true, java: false, php: false, python: false },
      levels: { easy: true, medium: false, hard: false },
      progress: { noStarted: true, started: false, finished: false }
    })

    // Llama a processFilters
    component.applyFilters()
    fixture.detectChanges()

    // Verifica que el evento filtersSelected se emitió con los valores correctos
    const expectedFilters = {
      languages: ['1'], // Solo JavaScript seleccionado
      levels: ['EASY'],
      progress: [1] // noStarted corresponde al primer valor
    }
    expect(component.filtersSelected.emit).toHaveBeenCalledWith(expectedFilters)
    expect(mockModalService.dismissAll).toHaveBeenCalled()
  })

  it('should open modal when open is called', () => {
    component.open()
    expect(mockModalService.open).toHaveBeenCalled()
  })
})
