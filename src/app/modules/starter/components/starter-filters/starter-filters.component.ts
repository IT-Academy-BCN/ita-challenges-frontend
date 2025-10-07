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
        this.initTagControl()
      })
  }

  hasSelectedTags(langKey: string): boolean {
    const group = this.tagsForm.get(langKey) as FormGroup | null;
    if (!group) return false;
    const values = group.getRawValue();
    return Object.values(values).some(v => !!v);
  }

  selectedTagCount(langKey: string): number {
    const group = this.tagsForm.get(langKey) as FormGroup | null;
    if (!group) return 0;
    const values = group.getRawValue();
    return Object.values(values).filter(v => !!v).length;
  }

 private setAllTags(langKey: string, checked: boolean): void {
    const group = this.tagsForm.get(langKey) as FormGroup | null;
    if (!group) return;
    Object.keys(group.controls).forEach(tagId => {
      group.get(tagId)?.setValue(checked, { emitEvent: false });
    });
  }

 private syncLanguageFromTags(langKey: string): void {
    const group = this.tagsForm.get(langKey) as FormGroup | null;
    const langCtrl = (this.filtersForm.get('languages') as FormGroup)?.get(langKey);
    if (!group || !langCtrl) return;
    const anySelected = Object.values(group.getRawValue()).some(Boolean);
    langCtrl.setValue(anySelected, { emitEvent: false });
  }

 private buildAndEmitFilters(): void {
    const fv = this.filtersForm.getRawValue();
    const filters: FilterChallenge = { languages: [], levels: [], progress: [], tags: [] };

    const languagesMap = this.languagesMapCtrl.value || {};
    Object.entries(fv.languages as Record<string, boolean>)
      .forEach(([key, on]) => on && languagesMap[key] && filters.languages.push(languagesMap[key]));

    const tagsGroup = this.filtersForm.get('tags') as FormGroup;
    if (tagsGroup) {
      Object.keys(tagsGroup.controls).forEach(langKey => {
        const langTagGroup = tagsGroup.get(langKey) as FormGroup;
        Object.entries(langTagGroup.value as Record<string, boolean>)
          .forEach(([tagId, checked]) => { if (checked) filters.tags?.push(tagId); });
      });
    }

    Object.entries(fv.levels as Record<string, boolean>)
      .forEach(([k, v]) => v && filters.levels.push(k.toUpperCase()));

    const progressMap: Record<string, number> = { noStarted: 1, started: 2, finished: 3 };
    Object.entries(fv.progress as Record<string, boolean>)
      .forEach(([k, v]) => v && progressMap[k] && filters.progress.push(progressMap[k]));

    this.filtersSelected.emit(filters);
  }

 private setupFormValueChanges(): void {
    this.filtersForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.buildAndEmitFilters());
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
              const allFalse = Object.keys(group.controls).reduce((acc, key) => {
                acc[key] = false
                return acc
              }, {} as Record<string, boolean>)
              group.patchValue(allFalse, { emitEvent: false })
            }
          }
        })
      })
  }

  private initTagControl(): void {
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
          const tagGroupForLanguage = this.createTagGroup(tags)
          if (!tagsRootGroup.get(langKey)) {
            tagsRootGroup.addControl(langKey, tagGroupForLanguage)
          } else {
            tagsRootGroup.setControl(langKey, tagGroupForLanguage)
          }
        })

        Object.keys(current).forEach(langKey => this.syncLanguageFromTags(langKey));
        Object.keys(current).forEach(langKey => {
          const grp = (this.filtersForm.get('tags') as FormGroup).get(langKey) as FormGroup;
          grp.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.syncLanguageFromTags(langKey));
        });
        this.buildAndEmitFilters();
      })
  }

  private createTagGroup(tags: Array<{ id_tag: string; tag_name: string }>): FormGroup {
    return this.fb.group(
      Object.fromEntries(tags.map(t => [t.id_tag, this.fb.nonNullable.control(false)]))
    )
  }
}
