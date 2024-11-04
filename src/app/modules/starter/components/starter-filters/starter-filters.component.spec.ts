import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule, FormBuilder } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { I18nModule } from '../../../../../assets/i18n/i18n.module'

import { StarterFiltersComponent } from './starter-filters.component'

describe('StarterFiltersComponent', () => {
  let component: StarterFiltersComponent
  let fixture: ComponentFixture<StarterFiltersComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StarterFiltersComponent],
      imports: [ReactiveFormsModule, I18nModule],
      providers: [FormBuilder]
    })
      .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StarterFiltersComponent)
    component = fixture.componentInstance
    component.isUserLoggedIn = true
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should emit filtersSelected event when form value changes', () => {
    spyOn(component.filtersSelected, 'emit')

    const languageInput: HTMLInputElement = fixture.debugElement.query(By.css('#checkJs')).nativeElement
    languageInput.click()
    fixture.detectChanges()

    const levelInput: HTMLInputElement = fixture.debugElement.query(By.css('#checkEasy')).nativeElement
    levelInput.click()
    fixture.detectChanges()

    const progressInput: HTMLInputElement = fixture.debugElement.query(By.css('#checkNoStarted')).nativeElement
    progressInput.click()
    fixture.detectChanges()

    expect(component.filtersSelected.emit).toHaveBeenCalled()

    const expectedFilter = {
      languages: [],
      levels: ['EASY'],
      progress: []
    }
    expect(component.filtersSelected.emit).toHaveBeenCalledWith(expectedFilter)
  })
})
