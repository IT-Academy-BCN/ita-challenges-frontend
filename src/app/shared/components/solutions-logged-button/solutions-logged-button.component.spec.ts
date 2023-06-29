import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionsLoggedButtonComponent } from './solutions-logged-button.component';

describe('SolutionsLoggedButtonComponent', () => {
  let component: SolutionsLoggedButtonComponent;
  let fixture: ComponentFixture<SolutionsLoggedButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolutionsLoggedButtonComponent]
    });
    fixture = TestBed.createComponent(SolutionsLoggedButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
