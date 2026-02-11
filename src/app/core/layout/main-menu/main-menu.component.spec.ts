import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { MainMenuComponent } from './main-menu.component'
import { RouterTestingModule } from '@angular/router/testing'
import { MobileNavComponent } from '../header/mobile-nav/mobile-nav.component'
import { DesktopNavComponent } from '../header/desktop-nav/desktop-nav.component'
import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing'
const ca = require('../../../../assets/i18n/ca.json');
const es = require('../../../../assets/i18n/es.json');
const en = require('../../../../assets/i18n/en.json');

describe('MainMenuComponent', () => {
  let component: MainMenuComponent
  let fixture: ComponentFixture<MainMenuComponent>
  let translate: TranslateService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainMenuComponent, MobileNavComponent, DesktopNavComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ]
    })
      .compileComponents()

    fixture = TestBed.createComponent(MainMenuComponent)
    component = fixture.componentInstance
    
    translate = TestBed.inject(TranslateService)
    translate.setTranslation('ca', ca);
    translate.setTranslation('es', es);
    translate.setTranslation('en', en);
    translate.setDefaultLang('ca')
    translate.use('ca')
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
  describe('Main navigation section', () => {
    it('should render 3 navigation items in main-options', () => {
      const compiled = fixture.nativeElement
      const links = compiled.querySelectorAll('#main-options a')
      
      expect(links.length).toBe(3)
    })
      
      describe.each([
        { lang: 'ca', expectedText: 'Classificació' },
        { lang: 'es', expectedText: 'Clasificación' },
        { lang: 'en', expectedText: 'Classification' }
      ])('Translations for $lang', ({ lang, expectedText }) => {
      
        it(`should render third navigation item in ${lang}`, async () => {
          translate.use(lang)
          
          await fixture.whenStable()
          fixture.detectChanges()
        
          const compiled = fixture.nativeElement
          const links = compiled.querySelectorAll('#main-options a')
        
          expect(links[2].textContent.trim()).toBe(expectedText)
        })
      })

    it('should render Challenges link with correct route', () => {
      const compiled = fixture.nativeElement
      const links = compiled.querySelectorAll('#main-options a')
      
      expect(links[1].getAttribute('ng-reflect-router-link')).toBe('challenges')
    })
  })

  describe('Footer-options section', () => {
    it('should render footer-options section', () => {
      const compiled = fixture.nativeElement
      const footer = compiled.querySelector('.footer-options')
      
      expect(footer).toBeTruthy()
    })

    it('should render 3 footer items', () => {
      const compiled = fixture.nativeElement
      const links = compiled.querySelectorAll('.footer-options a')
      
      expect(links.length).toBe(3)
    })
  })
  describe.each([
    { lang: 'ca', expectedText: 'Ajuda' },
    { lang: 'es', expectedText: 'Ayuda' },
    { lang: 'en', expectedText: 'Help' }
  ])('Second footer item (Help) - $lang', ({ lang, expectedText }) => {
  
    it(`should display "${expectedText}" when language is ${lang}`, async () => {
      translate.use(lang)
      await fixture.whenStable()
      fixture.detectChanges()
    
      const compiled = fixture.nativeElement
      const links = compiled.querySelectorAll('.footer-options a')
    
      expect(links[1].textContent.trim()).toBe(expectedText)
    })
  })
})