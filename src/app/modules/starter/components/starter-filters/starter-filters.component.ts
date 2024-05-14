import { Component, Output, EventEmitter, DestroyRef, inject } from '@angular/core'
import { type FilterChallenge } from 'src/app/models/filter-challenge.model'
import { FormBuilder } from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ChallengeService } from 'src/app/services/challenge.service'

@Component({
  selector: 'app-starter-filters',
  templateUrl: './starter-filters.component.html',
  styleUrls: ['./starter-filters.component.scss']
})
export class StarterFiltersComponent {
  @Output() filtersSelected = new EventEmitter<FilterChallenge>()

  filtersForm

  public languages: Record<string, string> = {}

  private readonly destroyRef = inject(DestroyRef)
  private readonly fb = inject(FormBuilder)
  private readonly challengeService = inject(ChallengeService)

  constructor () {
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

    this.challengeService.getAllLanguages().subscribe((res: any) => {
      if (res.results) {
        res.results.forEach((result: any) => {
          this.languages[result.language_name.toLowerCase()] = result.id_language
        })
      }
    })

    this.filtersForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(formValue => {
      const filters: FilterChallenge = { languages: [], levels: [], progress: [] }
      if (formValue.languages !== null && formValue.languages !== undefined) {
        Object.entries(formValue.languages).forEach(([key, val]) => {
          if (val) {
            const idLanguage = this.languages[key]
            if (idLanguage) {
              filters.languages.push(idLanguage)
            }
          }
        })
      }
      if (formValue.levels !== null && formValue.levels !== undefined) {
        Object.entries(formValue.levels).forEach(([key, val]) => {
          if (val) { filters.levels.push(key.toLocaleUpperCase()) }
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
