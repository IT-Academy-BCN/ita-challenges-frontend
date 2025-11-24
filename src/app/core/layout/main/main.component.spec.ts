import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { MainComponent } from './main.component'
import { HeaderComponent } from '../header/header.component'
import { MainMenuComponent } from '../main-menu/main-menu.component'
import { RouterTestingModule } from '@angular/router/testing'
import { FooterComponent } from '../footer/footer.component'
import { I18nModule } from 'src/assets/i18n/i18n.module'
import { SharedComponentsModule } from '../../../shared/components/shared-components.module'
import { MobileNavComponent } from '../header/mobile-nav/mobile-nav.component'
import { DesktopNavComponent } from '../header/desktop-nav/desktop-nav.component'
import { By } from '@angular/platform-browser'
import * as fs from 'fs'
import * as path from 'path'

describe('MainComponent', () => {
  let component: MainComponent
  let fixture: ComponentFixture<MainComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MainComponent,
        HeaderComponent,
        MainMenuComponent,
        FooterComponent,
        MobileNavComponent,
        DesktopNavComponent
      ],
      imports: [
        RouterTestingModule,
        I18nModule,
        SharedComponentsModule
      ]
    })
      .compileComponents()

    fixture = TestBed.createComponent(MainComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render a main container that is intended to fill the whole screen', () => {
    const wrapper = fixture.debugElement.query(By.css('#main-wrapper.container-fluid'))
    const mainContainer = fixture.debugElement.query(By.css('main#main-container'))

    expect(wrapper).not.toBeNull()
    expect(mainContainer).not.toBeNull()

    // Also ensure layout structure: main-container is inside the w-100 column
    const parent = mainContainer?.nativeElement?.parentElement
    expect(parent?.classList.contains('w-100')).toBe(true)
  })

  it('should define full-height styles for the main container and wrapper in the stylesheet (regression test)', () => {
    // Read the component SCSS to verify rules introduced/modified in uncommitted changes
    const scssPath = path.resolve(process.cwd(), 'src/app/core/layout/main/main.component.scss')
    const scss = fs.readFileSync(scssPath, 'utf8')

    // Basic presence checks of the selectors and properties controlling the full-height layout
    expect(scss).toContain('.container-fluid')
    expect(scss).toContain('min-height: 100%')

    expect(scss).toContain('#main-container')
    expect(scss).toMatch(/#main-container[\s\S]*height:\s*100%/)

    expect(scss).toContain('#main-wrapper')
    expect(scss).toMatch(/#main-wrapper[\s\S]*height:\s*100%/)
  })
})
