import { Component, Output, EventEmitter, DestroyRef, inject } from '@angular/core'
import { type FilterChallenge } from 'src/app/models/filter-challenge.model'
import { type FormBuilder } from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-starter-filters',
  templateUrl: './starter-filters.component.html',
  styleUrls: ['./starter-filters.component.scss']
})
export class StarterFiltersComponent {
  @Output() filtersSelected = new EventEmitter<FilterChallenge>()

  filtersForm

  private readonly destroyRef = inject(DestroyRef)

  constructor (private readonly fb: FormBuilder) {
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
    })

    this.filtersForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(formValue => {
      const filters: FilterChallenge = { languages: [], levels: [], progress: [] }
      if (formValue.languages !== null && formValue.languages !== undefined) {
        Object.values(formValue.languages).forEach((val, i) => {
          if (val) { filters.languages.push(i + 1) }
        })
      }

      if (formValue.levels !== null && formValue.levels !== undefined) {
        Object.entries(formValue.levels).forEach(([key, val]) => {
          if (val) { filters.levels.push(key) }
        })
      }

      if (formValue.progress !== null && formValue.progress !== undefined) {
        Object.values(formValue.progress).forEach((val, i) => {
          if (val) { filters.progress.push(i + 1) }
        })
      }
      this.filtersSelected.emit(filters)
    })
  }
}
