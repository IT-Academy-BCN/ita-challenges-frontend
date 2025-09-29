import { Component, Output, EventEmitter, DestroyRef, inject, OnInit } from '@angular/core'
import { type FilterChallenge } from 'src/app/models/filter-challenge.model'
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ChallengeFormService } from 'src/app/services/challenge-form.service'
import { TagResponse } from 'src/app/models/tag-response.interface'
import { type Language } from 'src/app/models/language.model'
import { AuthService } from 'src/app/services/auth.service'
import { forkJoin } from 'rxjs'
import { map, pairwise, startWith } from 'rxjs/operators'

type LanguagesMap = Record<string, string>
type TagsByLanguageMap = Record<string, Array<{ id_tag: string; tag_name: string }>>

@Component({
  selector: 'app-starter-filters',
  templateUrl: './starter-filters.component.html',
  styleUrls: ['./starter-filters.component.scss']
})
export class StarterFiltersComponent implements OnInit {
  @Output() filtersSelected = new EventEmitter<FilterChallenge>()

  private readonly destroyRef = inject(DestroyRef)
  private readonly fb = inject(FormBuilder)
  private readonly challengeFormService = inject(ChallengeFormService)
  private readonly authService = inject(AuthService)

  public isUserLoggedIn: boolean = false

  filtersForm: FormGroup = this.fb.nonNullable.group({
    data: this.fb.nonNullable.group({
      languagesMap: this.fb.nonNullable.control<LanguagesMap>({}),
      tagsByLanguage: this.fb.nonNullable.control<TagsByLanguageMap>({})
    }),
    languages: this.fb.group({}),
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

  private get languagesMapCtrl(): FormControl<LanguagesMap> {
    return this.filtersForm.get('data.languagesMap') as FormControl<LanguagesMap>
  }
  private get tagsByLanguageCtrl(): FormControl<TagsByLanguageMap> {
    return this.filtersForm.get('data.tagsByLanguage') as FormControl<TagsByLanguageMap>
  }

  get languageKeys(): string[] {
    return Object.keys(this.languagesMapCtrl.value || {})
  }

  get tagsByLanguage(): TagsByLanguageMap {
    return this.tagsByLanguageCtrl.value || {}
  }

  get tagsForm(): FormGroup {
    return this.filtersForm.get('tags') as FormGroup
  }

  constructor() {}

  ngOnInit(): void {
    this.setupFormValueChanges()

    this.authService.getUserRole()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (role) => { this.isUserLoggedIn = role !== '' },
        error: () => { this.isUserLoggedIn = false }
      })

    this.challengeFormService.getAllLangugesCreateForm()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: { results: Language[] }) => {
        const map: LanguagesMap = {}
        res?.results?.forEach(l => {
          map[l.language_name.toLowerCase()] = l.id_language
        })
        this.languagesMapCtrl.setValue(map, { emitEvent: false })

        const langControls: Record<string, any> =
          Object.keys(map).reduce((acc, key) => ({ ...acc, [key]: false }), {})
        this.filtersForm.setControl('languages', this.fb.group(langControls))

        this.wireLanguageUncheckWatcher()
        this.buildTagsControlsForkJoin()
      })
  }

  private setupFormValueChanges(): void {
    this.filtersForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(formValue => {
        const filters: FilterChallenge = { languages: [], levels: [], progress: [] }
        const languagesMap = this.languagesMapCtrl.value || {}

        if (formValue?.languages) {
          Object.entries(formValue.languages as Record<string, boolean>).forEach(([key, val]) => {
            if (val) {
              const idLanguage = languagesMap[key]
              if (idLanguage) filters.languages.push(idLanguage)
            }
          })
        }

        if (formValue?.levels) {
          Object.entries(formValue.levels as Record<string, boolean>).forEach(([key, val]) => {
            if (val) filters.levels.push(key.toUpperCase())
          })
        }

        if (formValue?.progress) {
          const progressMap: Record<string, number> = { noStarted: 1, started: 2, finished: 3 }
          Object.entries(formValue.progress as Record<string, boolean>).forEach(([k, v]) => {
            if (v && progressMap[k]) filters.progress.push(progressMap[k])
          })
        }

        this.filtersSelected.emit(filters)
      })
  }

  private wireLanguageUncheckWatcher(): void {
    const languagesGroup = this.filtersForm.get('languages') as FormGroup
    if (!languagesGroup) return

    languagesGroup.valueChanges
      .pipe(
        startWith(languagesGroup.value),
        pairwise(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([prev, curr]: [Record<string, boolean>, Record<string, boolean>]) => {
        const tagsRoot = this.filtersForm.get('tags') as FormGroup
        if (!tagsRoot) return

        Object.keys(curr || {}).forEach(langKey => {
          const wasOn = !!prev?.[langKey]
          const isOn = !!curr?.[langKey]

          if (wasOn && !isOn) {
            const group = tagsRoot.get(langKey) as FormGroup
            if (group) {
              Object.keys(group.controls).forEach(tagId => {
                const ctrl = group.get(tagId)
                if (ctrl?.value === true) {
                  ctrl.setValue(false, { emitEvent: false })
                }
              })
            }
          }
        })
      })
  }

  private buildTagsControlsForkJoin(): void {
    const tagsRootGroup = this.filtersForm.get('tags') as FormGroup
    const languagesMap = this.languagesMapCtrl.value || {}

    const requests = Object.entries(languagesMap)
      .map(([langKey, id]) => ({ langKey, id }))
      .filter(({ id }) => !!id)
      .map(({ langKey, id }) =>
        this.challengeFormService.getTagsByLanguage(id as string).pipe(
          map((resp: TagResponse) => ({
            langKey,
            tags: resp?.results ?? []
          }))
        )
      )

    if (!requests.length) return

    forkJoin(requests)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((langTags: Array<{ langKey: string; tags: Array<{ id_tag: string; tag_name: string }> }>) => {
        const current = { ...(this.tagsByLanguageCtrl.value || {}) }
        langTags.forEach(({ langKey, tags }) => {
          current[langKey] = tags
        })
        this.tagsByLanguageCtrl.setValue(current, { emitEvent: false })

        Object.entries(current).forEach(([langKey, tags]) => {
          const tagGroupForLanguage = this.fb.group(
            Object.fromEntries(tags.map(t => [t.id_tag, this.fb.nonNullable.control(false)]))
          )

          if (!tagsRootGroup.get(langKey)) {
            tagsRootGroup.addControl(langKey, tagGroupForLanguage)
          } else {
            tagsRootGroup.setControl(langKey, tagGroupForLanguage)
          }
        })
      })
  }
}
