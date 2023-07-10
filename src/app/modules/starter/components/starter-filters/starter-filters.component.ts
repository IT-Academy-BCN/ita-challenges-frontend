import { Component, Output, EventEmitter, DestroyRef, inject } from '@angular/core';
import { FilterChallenge } from 'src/app/models/filter-challenge.model';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-starter-filters',
  templateUrl: './starter-filters.component.html',
  styleUrls: ['./starter-filters.component.scss']
})
export class StarterFiltersComponent {

  @Output() filtersSelected = new EventEmitter<FilterChallenge>();

  filtersForm;

  private readonly destroyRef = inject(DestroyRef);
  
  constructor(private fb: FormBuilder) {
    this.filtersForm = this.fb.nonNullable.group({
      languages: this.fb.nonNullable.group({
        javascript: false,
        java: false,
        php: false,
        python: false
      }),
      levels: this.fb.nonNullable.group({
        easy: false,
        medium: false,
        hard: false
      }),
      progress: this.fb.nonNullable.group({
        noStarted: false,
        started: false,
        finished: false
      })
    });

    this.filtersForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(formValue => {
      let filters: FilterChallenge = {languages: [], levels: [], progress: []};
      Object.values(formValue.languages!).forEach((val, i) => {
        if (val == true) { filters.languages.push(i) }
      });
      Object.entries(formValue.levels!).forEach(([key, val]) => {
      if (val == true) { filters.levels.push(key) }
          });
      Object.values(formValue.progress!).forEach((val, i) => {
      if (val == true) { filters.progress.push(i) }
      });
      this.filtersSelected.emit(filters);
      console.log('llamada emmit componente hijo:' + filters.languages, filters.levels, filters.progress);
    });

  }



}