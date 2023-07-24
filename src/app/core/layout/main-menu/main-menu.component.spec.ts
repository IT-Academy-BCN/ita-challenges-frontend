import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MainMenuComponent } from './main-menu.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LoginModalComponent } from './../../../modules/modals/login-modal/login-modal.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';

describe('MainMenuComponent', () => {
  let component: MainMenuComponent;
  let fixture: ComponentFixture<MainMenuComponent>;
  let modalService: NgbModal;
  let debugElement: DebugElement;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgbModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [ MainMenuComponent ],
      providers: [ NgbModal, TranslateService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
    translate = TestBed.inject(TranslateService);
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should open the modal when the button is clicked', () => {
    spyOn(modalService, 'open');
    const button = debugElement.query(By.css('[data-testid="loginModalLink"]')).nativeElement;
    button.click();
    expect(modalService.open).toHaveBeenCalledWith(LoginModalComponent, { centered: true, size: 'lg' });
  });
  
  it('should call use language (translation) method when clicking on changelanguage button', () => {
    spyOn(translate, 'use');
    const buttonEs = debugElement.query(By.css('[data-testid="es"]')).nativeElement;
    buttonEs.click();
    expect(translate.use).toHaveBeenCalledWith('es');

    const buttonCat = debugElement.query(By.css('[data-testid="cat"]')).nativeElement;
    buttonCat.click();
    expect(translate.use).toHaveBeenCalledWith('cat');

    const buttonEn = debugElement.query(By.css('[data-testid="en"]')).nativeElement;
    buttonEn.click();
    expect(translate.use).toHaveBeenCalledWith('en');
  });
  

});
