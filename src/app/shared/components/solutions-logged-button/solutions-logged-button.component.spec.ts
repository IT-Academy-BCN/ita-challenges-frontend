import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SolutionsLoggedButtonComponent } from './solutions-logged-button.component';


describe('SolutionsLoggedButtonComponent', () => {
  let component: SolutionsLoggedButtonComponent;
  let fixture: ComponentFixture<SolutionsLoggedButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolutionsLoggedButtonComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SolutionsLoggedButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});