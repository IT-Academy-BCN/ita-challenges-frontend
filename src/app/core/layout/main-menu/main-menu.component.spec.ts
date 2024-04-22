import { type ComponentFixture, TestBed } from '@angular/core/testing'

import { MainMenuComponent } from './main-menu.component'
import { RouterTestingModule } from '@angular/router/testing'
import { I18nModule } from '../../../../assets/i18n/i18n.module'
import { MobileNavComponent } from '../header/mobile-nav/mobile-nav.component'

describe('MainMenuComponent', () => {
  let component: MainMenuComponent
  let fixture: ComponentFixture<MainMenuComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainMenuComponent, MobileNavComponent],
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
})
