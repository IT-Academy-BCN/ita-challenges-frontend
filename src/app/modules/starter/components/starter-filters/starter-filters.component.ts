import { Component, Output, EventEmitter, DestroyRef, inject, OnInit } from '@angular/core'
import { type FilterChallenge } from 'src/app/models/filter-challenge.model'
import { FormBuilder, FormGroup } from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ChallengeFormService } from 'src/app/services/challenge-form.service'
import { TagResponse } from 'src/app/models/tag-response.interface'
import { type Language } from 'src/app/models/language.model'
import { AuthService } from 'src/app/services/auth.service'
import { forkJoin } from 'rxjs'
import { map, pairwise, startWith } from 'rxjs/operators'


@Component({
  selector: 'app-starter-filters',
  templateUrl: './starter-filters.component.html',
  styleUrls: ['./starter-filters.component.scss']
})
export class StarterFiltersComponent implements OnInit{
  @Output() filtersSelected = new EventEmitter<FilterChallenge>()

  public languages: Record<string, string> = {}
  public tagsByLanguage: Record<string, Array<{ id_tag: string; tag_name: string }>> = {}

  private readonly destroyRef = inject(DestroyRef)
  private readonly fb = inject(FormBuilder)
  private readonly challengeFormService = inject(ChallengeFormService)
  private readonly authService = inject(AuthService)

  public isUserLoggedIn: boolean = false

  filtersForm: FormGroup = this.fb.nonNullable.group({
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
  });

  get languageKeys(): string[] {
    return Object.keys(this.languages);
  }

  get tagsForm(): FormGroup {
    return this.filtersForm.get('tags') as FormGroup;
  }

  constructor() {}

  ngOnInit(): void {

    this.setupFormValueChanges();
    
    this.authService.getUserRole()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (role) => { this.isUserLoggedIn = role !== ''; },
        error: () => { this.isUserLoggedIn = false; }
      });

    this.challengeFormService.getAllLangugesCreateForm()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: { results: Language[] }) => {
        this.languages = {};
        res?.results?.forEach(l => {
          this.languages[l.language_name.toLowerCase()] = l.id_language;
        });

        const langControls: Record<string, any> =
        this.languageKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {});
        this.filtersForm.setControl('languages', this.fb.group(langControls));
        this.wireLanguageUncheckWatcher();
        this.buildTagsControlsForkJoin();
      });
  }

  private setupFormValueChanges(): void {
    this.filtersForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(formValue => {
        const filters: FilterChallenge = { languages: [], levels: [], progress: [] };

        if (formValue?.languages) {
          Object.entries(formValue.languages as Record<string, boolean>).forEach(([key, val]) => {
            if (val) {
              const idLanguage = this.languages[key];
              if (idLanguage) filters.languages.push(idLanguage);
            }
          });
        }

        if (formValue?.levels) {
          Object.entries(formValue.levels as Record<string, boolean>).forEach(([key, val]) => {
            if (val) filters.levels.push(key.toUpperCase());
          });
        }

        if (formValue?.progress) {
          Object.values(formValue.progress as Record<string, boolean>).forEach((val, i) => {
            if (val) filters.progress.push(i + 1);
          });
        }

        this.filtersSelected.emit(filters);
      });
  }

  private wireLanguageUncheckWatcher(): void {
    const languagesGroup = this.filtersForm.get('languages') as FormGroup;
    if (!languagesGroup) return;

    languagesGroup.valueChanges
      .pipe(
        startWith(languagesGroup.value),
        pairwise(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([prev, curr]: [Record<string, boolean>, Record<string, boolean>]) => {
        const tagsRoot = this.filtersForm.get('tags') as FormGroup;
        if (!tagsRoot) return;

        Object.keys(curr || {}).forEach(langKey => {
          const wasOn = !!prev?.[langKey];
          const isOn = !!curr?.[langKey];

          if (wasOn && !isOn) {
            const group = tagsRoot.get(langKey) as FormGroup;
            if (group) {
              Object.keys(group.controls).forEach(tagId => {
                const ctrl = group.get(tagId);
                if (ctrl?.value === true) {
                  ctrl.setValue(false, { emitEvent: false });
                }
              });
            }
          }
        });
      });
  }

  private buildTagsControlsForkJoin(): void {
    const tagsRootGroup = this.filtersForm.get('tags') as FormGroup;

    const requests = this.languageKeys
      .map(langKey => ({ langKey, id: this.languages[langKey] }))
      .filter(({ id }) => !!id)
      .map(({ langKey, id }) =>
        this.challengeFormService.getTagsByLanguage(id as string).pipe(
          map((resp: TagResponse) => ({
            langKey,
            tags: resp?.results ?? []
          }))
        )
      );

    if (!requests.length) return;

    forkJoin(requests)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((langTags: Array<{ langKey: string; tags: Array<{ id_tag: string; tag_name: string }> }>) => {
        langTags.forEach(({ langKey, tags }) => {
          this.tagsByLanguage[langKey] = tags;

          const tagGroupForLanguage = this.fb.group(
            Object.fromEntries(tags.map(t => [t.id_tag, this.fb.nonNullable.control(false)]))
          );

          if (!tagsRootGroup.get(langKey)) {
            tagsRootGroup.addControl(langKey, tagGroupForLanguage);
          } else {
            tagsRootGroup.setControl(langKey, tagGroupForLanguage);
          }
        });
      });
  }}