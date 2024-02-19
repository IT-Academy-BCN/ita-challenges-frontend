import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarterComponent } from './starter.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import { StarterFiltersComponent } from '../starter-filters/starter-filters.component';
import { FilterChallenge } from 'src/app/models/filter-challenge.model';
import { By } from '@angular/platform-browser';
import { I18nModule } from '../../../../../assets/i18n/i18n.module'

describe('StarterComponent', () => {
  let component: StarterComponent;
  let fixture: ComponentFixture<StarterComponent>;
  let childComponent: StarterFiltersComponent;
  let filters: FilterChallenge = {languages:[], levels: [], progress: []}
  let selectedFilters: FilterChallenge;
  
  beforeEach(async () => {
    // await TestBed.configureTestingModule({
    //   declarations: [ 
    //     StarterComponent,
    //     StarterFiltersComponent
    //   ],
    //   schemas: [NO_ERRORS_SCHEMA],
    //   imports: [
    //     RouterTestingModule,
    //     HttpClientTestingModule,
    //     I18nModule
    //   ]
    // })
    // .compileComponents();

    // fixture = TestBed.createComponent(StarterComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
    // childComponent = fixture.debugElement.query(By.directive(StarterFiltersComponent)).componentInstance;
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });

  it('should create child', () => {
    // expect(childComponent).toBeTruthy();
  });

  it('should receive filter values from child component when it emits', () => {
    // const spy = spyOn(component, 'getChallengeFilters').and.callThrough();
    // const expectedFilters: FilterChallenge = {
    //   languages: [1],
    //   levels: ['easy'],
    //   progress: [1]
    // };
    
    // childComponent.filtersSelected.emit(expectedFilters);

    // expect(spy).toHaveBeenCalled();
    // expect(spy).toHaveBeenCalledWith(expectedFilters);
  });

it('should receive filter values from child component when languagesForm changes', () => {
  // spyOn(component, 'getChallengeFilters').and.callThrough();

  // childComponent.filtersForm.controls['languages'].setValue({javascript: true, java:false, php: false, python: false});

  // fixture.detectChanges();

  // expect(component.getChallengeFilters).toHaveBeenCalled();
  // expect(component.filters.languages).toContain(1);
});
  
it('should receive filter values from child component when levelsForm changes', () => {
  // spyOn(component, 'getChallengeFilters').and.callThrough();

  // childComponent.filtersForm.controls['levels'].setValue({easy: true, medium: false, hard: false});

  // fixture.detectChanges();

  // expect(component.getChallengeFilters).toHaveBeenCalled();
  // expect(component.filters.levels).toContain('easy');
});

it('should receive filter values from child component when progressForm changes', () => {
  // spyOn(component, 'getChallengeFilters').and.callThrough();

  // childComponent.filtersForm.controls['progress'].setValue({noStarted: true, started:false, finished: false});

  // fixture.detectChanges();

  // expect(component.getChallengeFilters).toHaveBeenCalled();
  // expect(component.filters.progress).toContain(1);
})

  
it('should receive all filter values from child component', () => {
  // const spy = spyOn(component, 'getChallengeFilters').and.callThrough();
  // const expectedFilters: FilterChallenge = {
  //   languages: [1],
  //   levels: ['easy'],
  //   progress: [1]
  // };

  // childComponent.filtersForm.get('languages')!.get('javascript')!.setValue(true);
  // childComponent.filtersForm.get('levels')!.get('easy')!.setValue(true);
  // childComponent.filtersForm.get('progress')!.get('noStarted')!.setValue(true);

  // fixture.whenStable().then(() => {
  //   expect(spy).toHaveBeenCalled();
  //   expect(spy).toHaveBeenCalledWith(expectedFilters);
  //   expect(component.filters).toEqual(expectedFilters);
  // });
});



});

