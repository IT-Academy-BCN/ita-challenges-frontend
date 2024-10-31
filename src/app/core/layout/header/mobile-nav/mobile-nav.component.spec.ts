import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileNavComponent } from './mobile-nav.component';
import { NavService } from 'src/app/services/nav.service';
import { TranslateModule } from '@ngx-translate/core';

// Mock de NavService
class MockNavService {
  public selectWidth = '69px';

  openLoginModal = jest.fn(); // Simula la función openLoginModal
  changeLanguage = jest.fn((language: string) => {
    this.selectWidth = language === 'ca' ? '69px' : '57px';
  });
}

describe('MobileNavComponent', () => {
  let component: MobileNavComponent;
  let fixture: ComponentFixture<MobileNavComponent>;
  let navService: NavService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobileNavComponent],
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: NavService, useClass: MockNavService }
      ]
    });

    fixture = TestBed.createComponent(MobileNavComponent);
    component = fixture.componentInstance;
    navService = TestBed.inject(NavService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call openLoginModal when openLoginModal is invoked', () => {
    component.openLoginModal();
    expect(navService.openLoginModal).toHaveBeenCalled();
  });

  it('should change language and update selectWidth', () => {
    const event = new Event('change');
    Object.defineProperty(event, 'target', { value: { value: 'es' }, enumerable: true });

    component.changeLanguage(event);

    expect(navService.changeLanguage).toHaveBeenCalledWith('es');
    expect(navService.selectWidth).toBe('57px'); // Verifica que el selectWidth se actualiza correctamente
  });

  it('should change language to "ca" and update selectWidth accordingly', () => {
    const event = new Event('change');
    Object.defineProperty(event, 'target', { value: { value: 'ca' }, enumerable: true });

    component.changeLanguage(event);

    expect(navService.changeLanguage).toHaveBeenCalledWith('ca');
    expect(navService.selectWidth).toBe('69px'); // Verifica que el selectWidth se actualiza correctamente
  });
});
