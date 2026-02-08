import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { MainMenuComponent } from './main-menu.component'
import { RouterTestingModule } from '@angular/router/testing'
import { I18nModule } from 'src/assets/i18n/i18n.module'
import { MobileNavComponent } from '../header/mobile-nav/mobile-nav.component'
import { DesktopNavComponent } from '../header/desktop-nav/desktop-nav.component'

describe('MainMenuComponent', () => {
  let component: MainMenuComponent
  let fixture: ComponentFixture<MainMenuComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainMenuComponent, MobileNavComponent, DesktopNavComponent],
      imports: [
        RouterTestingModule,
        I18nModule
      ]
    })
      .compileComponents()

    fixture = TestBed.createComponent(MainMenuComponent)
    component = fixture.componentInstance
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

    it('should render third navigation item with section7 translation key', () => {
      const compiled = fixture.nativeElement
      const links = compiled.querySelectorAll('#main-options a')
      
      expect(links[2]).toBeTruthy()
      expect(links.length).toBe(3)
    })

    it('should render Challenges link with correct route', () => {
      const compiled = fixture.nativeElement
      const links = compiled.querySelectorAll('#main-options a')
      
      expect(links[1].getAttribute('ng-reflect-router-link')).toBe('challenges')
    })
  })

  describe('Footer section', () => {
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

    it('should render footer items with translation pipes', () => {
      const compiled = fixture.nativeElement
      const links = compiled.querySelectorAll('.footer-options a')
      
      expect(links.length).toBe(3)
      expect(links[0]).toBeTruthy()
      expect(links[1]).toBeTruthy()
      expect(links[2]).toBeTruthy()
    })
  })
})