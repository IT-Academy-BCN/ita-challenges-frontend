import { FilterChallenge } from 'src/app/models/filter-challenge.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nModule } from '../../../../../assets/i18n/i18n.module';
import { StarterFiltersComponent } from './starter-filters.component';

describe('StarterFiltersComponent', () => {
  let component: StarterFiltersComponent;
  let fixture: ComponentFixture<StarterFiltersComponent>;
  let filters: FilterChallenge = {languages:[], levels: [], progress: []}

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StarterFiltersComponent],
      imports: [ I18nModule ]
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
