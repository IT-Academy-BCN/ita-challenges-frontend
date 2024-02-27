import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { HeaderComponent } from '../header/header.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FooterComponent } from '../footer/footer.component';
import { I18nModule } from '../../../../assets/i18n/i18n.module';
import { SharedComponentsModule } from '../../../shared/components/shared-components.module';
import { MobileNavComponent } from '../../../core/layout/header/mobile-nav/mobile-nav.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
                    MainComponent, 
                    HeaderComponent, 
                    MainMenuComponent, 
                    FooterComponent,
                    MobileNavComponent
                  ],
      imports: [
              RouterTestingModule,
              I18nModule,
              SharedComponentsModule
            ],  
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
