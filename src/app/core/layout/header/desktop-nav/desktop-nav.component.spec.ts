import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { DesktopNavComponent } from './desktop-nav.component'
import { TranslateService } from '@ngx-translate/core'
import { of } from 'rxjs'
import { RouterModule } from '@angular/router'

describe('DesktopNavComponent', () => {
  let component: DesktopNavComponent
  let fixture: ComponentFixture<DesktopNavComponent>
  let translateService: TranslateService
  let translateServiceUseMock: jest.Mock

  beforeEach(() => {
    translateServiceUseMock = jest.fn()

    const translateServiceStub = {
      use: translateServiceUseMock,
      addLangs: jest.fn(),
      setDefaultLang: jest.fn(),
      get: jest.fn().mockImplementation((key) => of(key))
    }

    TestBed.configureTestingModule({
      declarations: [DesktopNavComponent],
      imports: [RouterModule.forRoot([])], // Añade esta línea
      providers: [
        { provide: TranslateService, useValue: translateServiceStub }
      ]
    })

    fixture = TestBed.createComponent(DesktopNavComponent)
    component = fixture.componentInstance
    translateService = TestBed.inject(TranslateService)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should change language and update selectWidth', () => {
    // Limpiar todas las llamadas a la función simulada
    translateServiceUseMock.mockClear()

    const event = new Event('change')
    Object.defineProperty(event, 'target', { value: { value: 'es' }, enumerable: true })

    component.changeLanguage(event)

    expect(translateService.use).toHaveBeenCalledWith('es')
    expect(component.selectWidth).toBe('57px')
  })
})
