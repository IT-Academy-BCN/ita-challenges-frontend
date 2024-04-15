import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MainMenuComponent } from './main-menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nModule } from '../../../../assets/i18n/i18n.module';
import { MobileNavComponent } from '../header/mobile-nav/mobile-nav.component';
import { Router, RouterLink, provideRouter } from '@angular/router';
// import { routes } from '../../../app-routing.module'
// import { Location } from '@angular/common';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ChallengeComponent } from 'src/app/modules/challenge/components/challenge/challenge.component';

describe('MainMenuComponent', () => {
  let component: MainMenuComponent;
  let fixture: ComponentFixture<MainMenuComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainMenuComponent, MobileNavComponent ],
      imports: [
                RouterTestingModule, 
                I18nModule
              ],
      providers: [
        provideRouter([
          {
            path: 'challenges',
            component: ChallengeComponent
          }
        ])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    router.initialNavigation();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('first link should have the correct menu item', async () => {  
    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    const navItems = links.map( dElement => dElement.injector.get(RouterLink) );

    expect(navItems[0].href).toBe('/challenges');
  });

  it('should navigate to challenge page when first link is clicked', fakeAsync( () => {
  
    const linkItems = fixture.debugElement.queryAll(By.directive(RouterLink));
    linkItems[0].triggerEventHandler('click', { button: 0 });
    
    tick(); 
  
    const router = TestBed.inject(Router);
    expect(router.url).toBe('/challenges'); 
  }));
});








