import { Component, Output, EventEmitter, DestroyRef, inject, OnInit, OnDestroy } from '@angular/core'
import { type FilterChallenge } from 'src/app/models/filter-challenge.model'
import { FormBuilder, FormGroup } from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ChallengeFormService } from 'src/app/services/challenge-form.service'
import { TagResponse } from 'src/app/models/tag-response.interface'
import { type Language } from 'src/app/models/language.model'
import { AuthService } from 'src/app/services/auth.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-starter-filters',
  templateUrl: './starter-filters.component.html',
  styleUrls: ['./starter-filters.component.scss']
})
export class StarterFiltersComponent implements OnInit, OnDestroy {
  @Output() filtersSelected = new EventEmitter<FilterChallenge>()

  public languages: Record<string, string> = {}
  public languageKeys: string[] = []
  public tagsByLanguage: Record<string, Array<{ id_tag: string; tag_name: string }>> = {}

  private readonly destroyRef = inject(DestroyRef)
  private readonly fb = inject(FormBuilder)
  private readonly challengeFormService = inject(ChallengeFormService)
  private readonly authService = inject(AuthService)

  public isUserLoggedIn: boolean = false
  private userRoleSubs$!: Subscription

  filtersForm: FormGroup

  get tagsForm(): FormGroup {
    return this.filtersForm.get('tags') as FormGroup;
  }

  constructor() {
    this.filtersForm = this.fb.nonNullable.group({
      languages: this.fb.nonNullable.group({
        javascript: false,
        java: false,
        php: false,
        python: false
      }),
      tags: this.fb.group({}),
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

    const langGroup = this.filtersForm.get('languages') as FormGroup
    this.languageKeys = Object.keys(langGroup.controls)
    this.languageKeys.forEach(k => { this.tagsByLanguage[k] = [] })

    this.challengeFormService.getAllLangugesCreateForm()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: { results: Language[] }) => {
        res?.results?.forEach((result) => {
          this.languages[result.language_name.toLowerCase()] = result.id_language
        })

        this.buildTagsControls()
      })

    this.filtersForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(formValue => {
      const filters: FilterChallenge = { languages: [], levels: [], progress: [] }
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

 private buildTagsControls(): void {
  const tagsRootGroup = this.filtersForm.get('tags') as FormGroup
  const languagesGroup = this.filtersForm.get('languages') as FormGroup

  this.languageKeys.forEach((languageKey) => {
    const languageId = this.languages[languageKey]
    if (!languageId) return

    this.challengeFormService.getTagsByLanguage(languageId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((resp: TagResponse) => {
        const tags = resp?.results ?? []
        this.tagsByLanguage[languageKey] = tags

        const tagGroupForLanguage = this.fb.group({})
        tags.forEach(tag => {
          const tagControl = this.fb.nonNullable.control(false)

          // 🔹 Log a consola cuando cambia un tag
          tagControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((isChecked: boolean) => {
              if (isChecked) {
                console.log(`Tag seleccionado: ${tag.tag_name}, lenguaje: ${languageKey})`)
              } else {
                console.log(`Tag deseleccionado: ${tag.tag_name}, lenguaje: ${languageKey})`)
              }
            })

          tagGroupForLanguage.addControl(tag.id_tag, tagControl)
        })

        // Añade el grupo de tags al root si no existe todavía
        if (!tagsRootGroup.get(languageKey)) {
          tagsRootGroup.addControl(languageKey, tagGroupForLanguage)
        }

        // 🔹 Control que representa el checkbox del lenguaje (JS, Java, etc.)
        const languageControl = languagesGroup.get(languageKey)
        languageControl?.valueChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((isChecked: boolean) => {
            if (!isChecked) {
              // si desmarcamos el lenguaje, se desmarcan todos sus tags
              const currentTagGroup = tagsRootGroup.get(languageKey) as FormGroup
              Object.keys(currentTagGroup.controls).forEach(tagId => {
                currentTagGroup.get(tagId)?.setValue(false, { emitEvent: false })
              })
            }
          })
      })
  })
}


  ngOnInit(): void {
    this.userRoleSubs$ = this.authService.getUserRole().subscribe({
      next: (role) => {
        // Enable user-specific filters only for authenticated non-admin users
        this.isUserLoggedIn = role !== ''
      },
      error: (error) => {
        console.error('Error getting user role:', error)
        this.isUserLoggedIn = false
      }
    })
  }

  ngOnDestroy(): void {
    if (this.userRoleSubs$ !== undefined) this.userRoleSubs$.unsubscribe()
  }
}
