import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarterFiltersComponent } from './starter-filters.component';

describe('StarterFiltersComponent', () => {
  let component: StarterFiltersComponent;
  let fixture: ComponentFixture<StarterFiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StarterFiltersComponent]
    });
    fixture = TestBed.createComponent(StarterFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
