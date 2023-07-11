import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MobileNavComponent } from './mobile-nav/mobile-nav.component';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, MobileNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('should contain AppMobileNavComponent', () => {
    const appMobileNavElement = fixture.debugElement.query(By.directive(MobileNavComponent));
    expect(appMobileNavElement).not.toBeNull(); // Comprova que AppMobileNavComponent existeix dins d'AppComponent
  });
});
