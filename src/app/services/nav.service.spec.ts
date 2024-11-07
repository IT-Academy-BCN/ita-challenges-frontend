import { TestBed } from '@angular/core/testing';
import { NavService } from './nav.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

// Mock de NgbModal
class MockNgbModal {
  open() { return { result: Promise.resolve('closed') }; } // Simula el método `open`
}

// Mock de TranslateService
class MockTranslateService {
  private currentLang = 'ca';
  private langs: string[] = [];

  addLangs(langs: string[]) {
    this.langs = langs;
  }
  
  setDefaultLang(lang: string) {
    this.currentLang = lang;
  }
  
  use(lang: string) {
    this.currentLang = lang;
  }

  getLangs() {
    return this.langs;
  }

  getCurrentLang() {
    return this.currentLang;
  }
}

describe('NavService', () => {
  let service: NavService;
  let modalService: NgbModal;
  let translateService: MockTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavService,
        { provide: NgbModal, useClass: MockNgbModal },
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    });
    service = TestBed.inject(NavService);
    modalService = TestBed.inject(NgbModal);
    translateService = TestBed.inject(TranslateService) as unknown as MockTranslateService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open the login modal', () => {
    const modalSpy = spyOn(modalService, 'open').and.callThrough(); 
    service.openLoginModal();
    expect(modalSpy).toHaveBeenCalledWith(jasmine.any(Function), { centered: true, size: 'lg' });
  });

  it('should change the language and update selectWidth correctly', () => {
    service.changeLanguage('es');
    expect(translateService.getCurrentLang()).toBe('es');
    expect(service.selectWidth).toBe('57px');

    service.changeLanguage('ca');
    expect(translateService.getCurrentLang()).toBe('ca');
    expect(service.selectWidth).toBe('69px');
  });

  it('should set available languages and default language on creation', () => {
    expect(translateService.getLangs()).toEqual(['en', 'es', 'ca']);
    expect(translateService.getCurrentLang()).toBe('ca');
  });
});
