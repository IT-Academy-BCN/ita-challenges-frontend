import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { DesktopNavComponent } from './desktop-nav.component'
import { NavService } from 'src/app/services/nav.service'
import { TranslateModule } from '@ngx-translate/core'
import { RouterModule, ActivatedRoute } from '@angular/router'
import { AuthService } from 'src/app/services/auth.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser'

class MockNavService {
  public selectWidth = '69px'

  changeLanguage = jest.fn((language: string) => {
    this.selectWidth = language === 'ca' ? '69px' : '57px'
  })
  openRegisterUsersModal = jest.fn();
}
class MockAuthService {
  updateUserRoleAndUserNameFromToken = jest.fn();
  getUsername = jest.fn(() => of('test-user'));
  isLoggedIn$ = of(true);
  logout = jest.fn();
  switchRole = jest.fn(() => of({ token: 'newToken' }));
  getUserRole() {
    return of('')
  };

  getUserPhoto = jest.fn(() => of('https://mock-photo-url.com/avatar.png'))

  checkAndHandleExpiredToken = jest.fn()
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
  let authService: MockAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesktopNavComponent, MockToggleComponent],
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      providers: [
        { provide: NavService, useClass: MockNavService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })

    fixture = TestBed.createComponent(DesktopNavComponent)
    component = fixture.componentInstance
    navService = TestBed.inject(NavService) as unknown as MockNavService
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
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
    fixture.detectChanges();

    const dropdownElement = fixture.debugElement.query(By.css('.dropdown'));
    dropdownElement.nativeElement.dispatchEvent(new MouseEvent('click'));

    expect(component.dropdownOpen).toBe(true);
  });

  it('should load user from AuthService', () => {
    jest.spyOn(authService, 'getUsername').mockReturnValue(of('test-user')); 
    component.ngOnInit();
    expect(component.user).toBe('test-user');
  });

  it('should set user to empty string if AuthService returns empty', () => {
    jest.spyOn(authService, 'getUsername').mockReturnValue(of('')); 
    component.ngOnInit(); 
    expect(component.user).toBe('');
  });

  it('should set currentRole to empty string if AuthService returns empty', () => {
    jest.spyOn(authService, 'getUserRole').mockReturnValue(of(''))
    component.ngOnInit()
    expect(component.currentRole).toBe('')
  })

  it('should call logout method from AuthService when logout is triggered', () => {
    const logoutSpy = jest.spyOn(authService, 'logout');
  
    component.logout();
  
    expect(logoutSpy).toHaveBeenCalled();
  });

  it('should switch role and update token on success', () => {
    const newRole = 'ADMIN';
    const switchRoleSpy = jest.spyOn(authService, 'switchRole').mockReturnValue(of({ token: 'newToken' }));
    const updateTokenSpy = jest.spyOn(authService, 'updateUserRoleAndUserNameFromToken');
    
    component.onSwitchRole(newRole);
    
    expect(switchRoleSpy).toHaveBeenCalledWith(newRole);
    expect(localStorage.getItem('authToken')).toBe('newToken');
    expect(updateTokenSpy).toHaveBeenCalled();
  });

  it('should log an error when switch role fails', () => {
    const newRole = 'ADMIN';
    const errorResponse = { message: 'Error switching role' };
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(authService, 'switchRole').mockReturnValue(throwError(errorResponse));
    
    component.onSwitchRole(newRole);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('error changing your role', errorResponse);
    consoleErrorSpy.mockRestore();
  });

  it('should call openRegisterUsersModal on navService', () => {
    const openModalSpy = jest.spyOn(navService, 'openRegisterUsersModal');
    component.openRegisterUsersModal();
    expect(openModalSpy).toHaveBeenCalled();
  });
})
