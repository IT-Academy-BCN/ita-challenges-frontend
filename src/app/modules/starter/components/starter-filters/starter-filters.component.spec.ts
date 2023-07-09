import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { StarterFiltersComponent } from './starter-filters.component';

describe('StarterFiltersComponent', () => {
  let component: StarterFiltersComponent;
  let fixture: ComponentFixture<StarterFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StarterFiltersComponent],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarterFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filtersSelected event when form value changes', () => {
    spyOn(component.filtersSelected, 'emit');

    component.filtersForm.patchValue({
      languages: { javascript: true, java: false, php: false, python: false },
      levels: { easy: true, medium: false, hard: false },
      progress: { noStarted: true, started: false, finished: false },
    });

    fixture.detectChanges();

    expect(component.filtersSelected.emit).toHaveBeenCalled();

    const expectedFilter = {
      languages: [0],
      levels: ['easy'],
      progress: [0]
    };
    expect(component.filtersSelected.emit).toHaveBeenCalledWith(expectedFilter);
  });
});
