import { FilterChallenge } from 'src/app/models/filter-challenge.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarterFiltersComponent } from './starter-filters.component';

describe('StarterFiltersComponent', () => {
  let component: StarterFiltersComponent;
  let fixture: ComponentFixture<StarterFiltersComponent>;
  let filters: FilterChallenge = {languages:[], levels: [], progress: []}

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

  it('should return filters array object', () => {
    expect(component.getAllFilters()).toEqual(filters);
  });
});
