import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { MobileNavComponent } from './mobile-nav.component'
import { NavService } from 'src/app/services/nav.service'
import { TranslateModule } from '@ngx-translate/core'
import { ActivatedRoute, RouterModule } from '@angular/router'

class MockNavService {
  public selectWidth = '69px'

  changeLanguage = jest.fn((language: string) => {
    this.selectWidth = language === 'ca' ? '69px' : '57px'
  })
}

const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: jest.fn().mockReturnValue(null)
    }
  }
}

describe('MobileNavComponent', () => {
  let component: MobileNavComponent
  let fixture: ComponentFixture<MobileNavComponent>
  let navService: MockNavService

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobileNavComponent],
      imports: [TranslateModule.forRoot(), RouterModule.forRoot([])],
      providers: [
        { provide: NavService, useClass: MockNavService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })

    fixture = TestBed.createComponent(MobileNavComponent)
    component = fixture.componentInstance
    navService = TestBed.inject(NavService) as unknown as MockNavService
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should change language and update selectWidth', () => {
    const event = new Event('change')
    Object.defineProperty(event, 'target', { value: { value: 'es' }, enumerable: true })

    component.changeLanguage(event)

    expect(navService.changeLanguage).toHaveBeenCalledWith('es')
    expect(navService.selectWidth).toBe('57px')
  })

  it('should change language to "ca" and update selectWidth accordingly', () => {
    const event = new Event('change')
    Object.defineProperty(event, 'target', { value: { value: 'ca' }, enumerable: true })

    component.changeLanguage(event)

    expect(navService.changeLanguage).toHaveBeenCalledWith('ca')
    expect(navService.selectWidth).toBe('69px')
  })

  it('should update isLoggedIn when onLoginSuccess is called', () => {
    component.onLoginSuccess(true)
    expect(component.isLoggedIn).toBe(true)

    component.onLoginSuccess(false)
    expect(component.isLoggedIn).toBe(false)
  })
})
