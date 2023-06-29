import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionsUnloggedButtonComponent } from './solutions-unlogged-button.component';

describe('SolutionsUnloggedButtonComponent', () => {
  let component: SolutionsUnloggedButtonComponent;
  let fixture: ComponentFixture<SolutionsUnloggedButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolutionsUnloggedButtonComponent]
    });
    fixture = TestBed.createComponent(SolutionsUnloggedButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
