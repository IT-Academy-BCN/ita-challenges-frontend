import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { DesktopNavComponent } from './desktop-nav.component'
import { NavService } from 'src/app/services/nav.service'
import { TranslateModule } from '@ngx-translate/core'
import { RouterModule, ActivatedRoute } from '@angular/router'

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

describe('DesktopNavComponent', () => {
  let component: DesktopNavComponent
  let fixture: ComponentFixture<DesktopNavComponent>
  let navService: MockNavService

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesktopNavComponent],
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      providers: [
        { provide: NavService, useClass: MockNavService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })

    fixture = TestBed.createComponent(DesktopNavComponent)
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

  it('should toggle dropdownOpen', () => {
    expect(component.dropdownOpen).toBeFalsy();
    component.toggleDropdown();
    expect(component.dropdownOpen).toBe(true);
    component.toggleDropdown();
    expect(component.dropdownOpen).toBe(false);
  });

  it('should close dropdown when clicking outside', () => {
    component.dropdownOpen = true;

    const event = new MouseEvent('click');
    const fakeTarget = document.createElement('div');
    Object.defineProperty(event, 'target', { value: fakeTarget });

    component.onClickOutside(event);
    expect(component.dropdownOpen).toBe(false);
  });

  it('should not close dropdown if click is inside .dropdown', () => {
    component.dropdownOpen = true;

    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown');
    document.body.appendChild(dropdown);

    const event = new MouseEvent('click');
    Object.defineProperty(event, 'target', { value: dropdown });

    component.onClickOutside(event);
    expect(component.dropdownOpen).toBe(true);

    document.body.removeChild(dropdown);
  });

  it('should not close dropdown if click is on .user button', () => {
    component.dropdownOpen = true;

    const userBtn = document.createElement('button');
    userBtn.classList.add('user');
    document.body.appendChild(userBtn);

    const event = new MouseEvent('click');
    Object.defineProperty(event, 'target', { value: userBtn });

    component.onClickOutside(event);
    expect(component.dropdownOpen).toBe(true);

    document.body.removeChild(userBtn);
  });

  it('should load user from localStorage', () => {
    localStorage.setItem('username', 'test-user');
    component.getUserFromLocalStorage();
    expect(component.user).toBe('test-user');
    localStorage.removeItem('username');
  });

  it('should set user to empty string if no username in localStorage', () => {
    localStorage.removeItem('username');
    component.getUserFromLocalStorage();
    expect(component.user).toBe('');
  });
})
