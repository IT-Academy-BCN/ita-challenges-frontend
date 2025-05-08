import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule, FormBuilder } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { I18nModule } from '../../../../../assets/i18n/i18n.module'
import { of } from 'rxjs'
import { AuthService } from 'src/app/services/auth.service'

import { StarterFiltersComponent } from './starter-filters.component'

describe('StarterFiltersComponent', () => {
  let component: StarterFiltersComponent
  let fixture: ComponentFixture<StarterFiltersComponent>
  let authServiceMock: any

  beforeEach(async () => {
    authServiceMock = {
      getUserRole: jest.fn().mockReturnValue(of(''))
    }

    await TestBed.configureTestingModule({
      declarations: [StarterFiltersComponent],
      imports: [ReactiveFormsModule, I18nModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
      .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StarterFiltersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should emit filtersSelected event when form value changes', () => {
    // Set up user as logged in for this test
    authServiceMock.getUserRole.mockReturnValue(of('ALUMNI'))
    component.ngOnInit()
    component.isUserLoggedIn = true
    fixture.detectChanges()

    const emitSpy = jest.spyOn(component.filtersSelected, 'emit')

    const languageInput: HTMLInputElement = fixture.debugElement.query(By.css('#checkJs')).nativeElement
    languageInput.click()
    fixture.detectChanges()

    const levelInput: HTMLInputElement = fixture.debugElement.query(By.css('#checkEasy')).nativeElement
    levelInput.click()
    fixture.detectChanges()

    const progressElement = fixture.debugElement.query(By.css('#checkNoStarted'))
    if (progressElement) {
      const progressInput: HTMLInputElement = progressElement.nativeElement
      progressInput.click()
      fixture.detectChanges()
    }

    expect(emitSpy).toHaveBeenCalled()

    const expectedFilter = {
      languages: [],
      levels: ['EASY'],
      progress: progressElement ? [1] : []
    }
    expect(emitSpy).toHaveBeenCalledWith(expectedFilter)
  })

  describe('User role-based display', () => {
    it('should display progress filters when user role is not empty and not ADMIN', () => {
      authServiceMock.getUserRole.mockReturnValue(of('ALUMNI'))
      
      component.ngOnInit()
      fixture.detectChanges()
      
      expect(component.isUserLoggedIn).toBe(true)
      const progressSection = fixture.debugElement.query(By.css('[formGroupName="progress"]'))
      expect(progressSection).toBeTruthy()
    })
    
    it('should display progress filters when user role is ADMIN', () => {
      authServiceMock.getUserRole.mockReturnValue(of('ADMIN'))
      
      component.ngOnInit()
      fixture.detectChanges()
      
      expect(component.isUserLoggedIn).toBe(true)
      const progressSection = fixture.debugElement.query(By.css('[formGroupName="progress"]'))
      expect(progressSection).toBeTruthy()
    })
    
    it('should hide progress filters when user is not logged in (empty role)', () => {
      authServiceMock.getUserRole.mockReturnValue(of(''))
      
      component.ngOnInit()
      fixture.detectChanges()
      
      expect(component.isUserLoggedIn).toBe(false)
      const progressSection = fixture.debugElement.query(By.css('[formGroupName="progress"]'))
      expect(progressSection).toBeFalsy()
    })
  })
})
