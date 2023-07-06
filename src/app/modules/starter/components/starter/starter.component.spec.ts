import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarterComponent } from './starter.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import { StarterFiltersComponent } from '../starter-filters/starter-filters.component';
import { FilterChallenge } from 'src/app/models/filter-challenge.model';

describe('StarterComponent', () => {
  let component: StarterComponent;
  let childComponent: StarterFiltersComponent;
  let fixture: ComponentFixture<StarterComponent>;
  let childFixture: ComponentFixture<StarterFiltersComponent>;
  let filters: FilterChallenge = {languages:[], levels: [], progress: []}
  let selectedFilters: FilterChallenge;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        StarterComponent,
        StarterFiltersComponent
       ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarterComponent);
    component = fixture.componentInstance;
    childFixture = TestBed.createComponent(StarterFiltersComponent);
    childComponent = childFixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create child', () => {
    expect(childComponent).toBeTruthy();
  });

  it('should get filters on child', () => {
    selectedFilters = childComponent.getAllFilters();
    expect(selectedFilters).toEqual(filters)
  });

  it('should parent recibe filters from child', () => {
    spyOn(childComponent, 'getAllFilters');
    spyOn(component, 'getChallengeFilters');
    

    childComponent.checkFilter();
    //fixture.detectChanges();
    //childFixture.detectChanges();
    component.getChallengeFilters(filters);
    //childComponent.filtersSelected.emit(filters);

    //expect(component.filters).toEqual(selectedFilters);
    expect(childComponent.getAllFilters).toHaveBeenCalled();
    expect(component.getChallengeFilters).toHaveBeenCalled();

  });

});
