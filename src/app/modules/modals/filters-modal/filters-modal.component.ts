import { Component, Output, ViewChild, EventEmitter, inject, type TemplateRef } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { FormBuilder } from '@angular/forms'
import { type FilterChallenge } from 'src/app/models/filter-challenge.model'
import { ChallengeService } from 'src/app/services/challenge.service'
import { type Language } from 'src/app/models/language.model'

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html',
  styleUrls: ['./filters-modal.component.scss']
})
export class FiltersModalComponent {
  @Output() filtersSelected = new EventEmitter<FilterChallenge>()
  @ViewChild('modal') private readonly modalContent!: TemplateRef<FiltersModalComponent>
  private readonly modalService = inject(NgbModal)
  private readonly formBuilder = inject(FormBuilder)
  private readonly challengeService = inject(ChallengeService)
  public languages: Record<string, string> = {}
  formGroup = this.formBuilder.group({
    languages: this.formBuilder.nonNullable.group({
      javascript: false,
      java: false,
      php: false,
      python: false
    }),
    levels: this.formBuilder.nonNullable.group({
      easy: false,
      medium: false,
      hard: false
    }),
    progress: this.formBuilder.nonNullable.group({
      noStarted: false,
      started: false,
      finished: false
    })
  })

  applyFilters (): void {
    this.challengeService.getAllLanguages().subscribe((res: any) => {
      if (res.results !== undefined) {
        this.languages = res.results.reduce((acc: Record<string, string>, result: Language) => {
          acc[result.language_name.toLowerCase()] = result.id_language
          return acc
        }, {})

        // Procesar filtros después de cargar los idiomas
        this.processFilters()
      }
    })
  }

  private processFilters (): void {
    const formValue = this.formGroup.value
    const filters: FilterChallenge = { languages: [], levels: [], progress: [] }

    // Manejo de languages
    if (formValue.languages !== null && formValue.languages !== undefined) {
      Object.entries(formValue.languages).forEach(([key, val]) => {
        if (val) {
          const idLanguage = this.languages[key]
          if (idLanguage !== '') {
            filters.languages.push(idLanguage)
          }
        }
      })
    }

    // Manejo de levels
    if (formValue.levels !== null && formValue.levels !== undefined) {
      Object.entries(formValue.levels).forEach(([key, val]) => {
        if (val) {
          filters.levels.push(key.toUpperCase())
        }
      })
    }

    // Manejo de progress
    if (formValue.progress !== null && formValue.progress !== undefined) {
      Object.entries(formValue.progress).forEach(([key, val], i) => {
        if (val) {
          filters.progress.push(i + 1)
        }
      })
    }

    this.filtersSelected.emit(filters)
    this.modalService.dismissAll()
  }

  open (): void {
    this.modalService.open(this.modalContent, { size: 'lg' })
  }
}
