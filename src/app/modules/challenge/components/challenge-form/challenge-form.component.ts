import { Component, inject, ViewChild, type ElementRef, type AfterViewInit, type OnDestroy,Input, OnInit, ChangeDetectorRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { ChallengeService } from 'src/app/services/challenge.service'
import { type CreateChallenge } from '../../../../models/create-challenge.interface'
import { FormsModule, FormControl, Validators, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { type Language } from 'src/app/models/challenges.interface'
import { ChallengeFormService } from '../../../../services/challenge-form.service'
import { EditorModule } from '@tinymce/tinymce-angular'
import { SolutionService } from 'src/app/services/solution.service'

import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { ToastrService } from 'ngx-toastr';
import { Inject } from '@angular/core'

// Imports para CodeMirror
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { java } from '@codemirror/lang-java'
import { python } from '@codemirror/lang-python'
import { basicSetup } from 'codemirror'

import { type TagResponse } from 'src/app/models/tag-response.interface'
import { type Challenge } from 'src/app/models/challenge.model'

import { CommonModalService } from "src/app/services/common-modal.service"; 
import { StarterService } from 'src/app/services/starter.service'
import { AuthService } from 'src/app/services/auth.service'
import { Observable, of, from} from 'rxjs'
import { take, switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-challenge-form',
  templateUrl: './challenge-form.component.html',
  styleUrls: ['./challenge-form.component.scss'],
  imports: [FormsModule, CommonModule, EditorModule, TranslateModule, ReactiveFormsModule]
})
export class ChallengeFormComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('codeMirrorEditor') codeMirrorEditor!: ElementRef
  @Input() isEditMode: boolean = false;
  @Input() challengeIdToEdit: string = '';

  public editor: EditorView | null = null
  tagsControl = new FormControl<string[]>([], {validators: Validators.required, nonNullable: true});

  challenge: CreateChallenge = {
    challengeTitle: '',
    description: '',
    level: 'EASY',
    language: '' as string,
    solution: '',
    topic: 'ALL',
    tags: []
  }

  languages: Language[] = []
  selectedLanguageId: string = ''
  currentTags: any[] = []
  selectedTags: string[] = []

  editorConfig = {
    base_url: '/assets/tinymce',
    suffix: '.min',
    height: 260,
    menubar: false,
    branding: false,
    elementpath: false,
    statusbar: false,
    license_key: 'gpl',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'charmap',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons'
    ],
    toolbar: 'undo redo | formatselect | ' +
      'h2 h3 | bold italic underline | forecolor backcolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | emoticons | help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
  }

  private readonly challengeService = inject(ChallengeService)
  private readonly challengeFormService = inject(ChallengeFormService)
  private readonly solutionService = inject(SolutionService)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly commonModalService = inject(CommonModalService)
  private readonly starterService = inject(StarterService)
  private readonly authService = inject(AuthService)
  userRole$: Observable<string> = this.authService.getUserRole();
  constructor (
    @Inject(TranslateService) readonly translate: TranslateService,
    private toastr: ToastrService
  ) {
    this.loadLanguages()
    translate.addLangs(['en', 'es', 'ca'])
  }
  ngOnInit(): void {
  this.tagsControl.valueChanges.subscribe(value => {
    this.selectedTags = value || [];
  });

     this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.challengeIdToEdit = params['id'];
        this.loadChallengeForEditing();
      }
    });
  }

  // Método que se ejecuta cuando el componente está listo
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  ngAfterViewInit (): void {
     if (!this.isEditMode) {
      this.initCodeMirror()
    }
  }
  // Método que se ejecuta cuando el componente se destruye
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  ngOnDestroy (): void {
    if (this.editor != null) {
      this.editor.destroy()
    }
  }

  // Inicializa el editor CodeMirror
  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private initCodeMirror () {
    if (!this.codeMirrorEditor?.nativeElement) return;

    this.editor = new EditorView({
      parent: this.codeMirrorEditor.nativeElement,
      state: this.createEditorState()
    });
  }

  // Obtiene la extensión de lenguaje para CodeMirror
  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private getLanguageExtension (language: string) {
    const extensions = {
      Javascript: javascript,
      Java: java,
      Python: python,
      Typescript: javascript, // Usamos javascript para TypeScript
      PHP: javascript, // Fallback a javascript
      SQL: javascript // Fallback a javascript
    }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return extensions[language as keyof typeof extensions] || javascript
  }

  loadLanguages (): void {
    this.challengeFormService.getAllLangugesCreateForm().subscribe({
      next: ({ results }) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        this.languages = results || []
      },
      error: (err) => {
       this.languages = []
       throw err;
      }
    })
  }

loadChallengeForEditing(): void {
    if (!this.challengeIdToEdit) return;

    this.challengeService.getChallengeById(this.challengeIdToEdit).subscribe({
      next: (challenge: Challenge) => {
        const editableChallenge = challenge as Challenge & { topic?: string, tags?: string[] };

        this.challenge = {
          challengeTitle: editableChallenge.challenge_title || '',
          description: editableChallenge.detail?.description || '',
          level: (editableChallenge.level || 'EASY') as 'EASY' | 'MEDIUM' | 'HARD',
          language: editableChallenge.languages?.[0]?.language_name || '',
          solution: '',
          topic: editableChallenge.topic || 'ALL',
          tags: editableChallenge.tags || []
        };

        this.selectedLanguageId = editableChallenge.languages?.[0]?.id_language || '';
        this.tagsControl.setValue(editableChallenge.tags || []);

        this.loadSolutionContent();

        if (this.selectedLanguageId) {
          this.loadTags();
        }
      },
      error: (err) => {
        throw err;
      }
    });
  }

  private handleEditorUpdate(): void {
  if (this.editor) {
    this.updateCodeMirror();
  } else {
    this.initCodeMirror();
  }
  this.cdr.detectChanges();
}

  private loadSolutionContent(): void {
  if (this.challengeIdToEdit && this.selectedLanguageId) {
    this.solutionService.getAllChallengeSolutions(this.challengeIdToEdit, this.selectedLanguageId).subscribe({
      next: (dataSolution) => {
        if (dataSolution.results.length > 0) {
          this.challenge.solution = dataSolution.results[0].solution_text;
        } else {
          this.challenge.solution = 'function solution() {\n  // Tu código aquí\n  return resultado;\n}';
        }
        this.handleEditorUpdate();
      },
      error: (err) => {
        this.challenge.solution = 'function solution() {\n  // Tu código aquí\n  return resultado;\n}';
        this.handleEditorUpdate();
        throw err;
      }
    });
  } else {
    this.challenge.solution = 'function solution() {\n  // Tu código aquí\n  return resultado;\n}';
    this.handleEditorUpdate();
  }
}

   private updateCodeMirror(): void {
    if (this.editor) {
      this.editor.setState(this.createEditorState());
    }
  }

  onLanguageChange (language: string): void {
    this.challenge.language = language
    const selectedLang = this.languages.find(lang => lang.language_name === language)
    this.selectedLanguageId = (selectedLang != null) ? selectedLang.id_language : ''
    this.loadTags()
    if (this.editor != null) {
      this.editor.setState(this.createEditorState(this.editor.state.doc.toString()));
    }
  }

  loadTags (): void {
    if (this.selectedLanguageId.length === 0) {
      return
    }
    this.challengeFormService.getTagsByLanguage(this.selectedLanguageId).subscribe({
      next: (response: TagResponse) => {
        this.currentTags = response.results ?? []
            if (this.isEditMode && this.selectedTags.length > 0) {
        this.selectedTags = this.selectedTags.filter(tagId => 
          this.currentTags.some(tag => tag.id_tag === tagId)
        );
        
      this.tagsControl.setValue(this.selectedTags);
          } else {
            this.tagsControl.setValue([]);
          }
        },
        error: (error) => {
          this.currentTags = [];
          this.tagsControl.setValue([]);
          //throw error;
          console.error('Error loading tags:', error);
        }
      });
    }

  // Validación del formulario (código original)
  public isFormValid (): boolean {
    const isLanguageValid = this.languages.some(lang =>
      lang.language_name === this.challenge.language
    )

    const title = this.challenge.challengeTitle
    const description = this.challenge.description

    const isTitleValid = typeof title === 'string'
      ? title.trim() !== ''
      : title && Object.values(title).some((v: any) => v.trim() !== '')

    const isDescriptionValid = typeof description === 'string'
      ? description.trim() !== ''
      : description && Object.values(description).some((v: any) => v.trim() !== '')

    return (
      isTitleValid &&
      isDescriptionValid &&
      isLanguageValid &&
      this.challenge.solution.trim() !== ''
    )
  }

  public isFormAndTagsValid (): boolean {
    return this.isFormValid() && this.tagsControl.valid;
  }

  onCancel (): void {
    // 🚀 TODO: En el futuro, cambiar esta redirección al dashboard del mentor
    void this.router.navigate(['/ita-challenge/challenges'])
  }

  // Envío del formulario (código original)
  onSubmit(): void {
    if (!this.isFormAndTagsValid()) {
      this.tagsControl.markAsTouched();
      return;
    }
    this.challenge.tags = [...this.selectedTags];

    if (this.isEditMode && this.challengeIdToEdit) {
      this.challengeService.editChallenge(this.challengeIdToEdit, this.challenge).subscribe({
        next: (response) => {
          void this.router.navigate(['/ita-challenge/challenges'])
        },
        error: (err) => {
          throw err;
        }
      })
    } else {
      this.commonModalService.loadingPostingChallengeModal();

      this.challengeService.createChallenge(this.challenge).subscribe({
        next: () => {
          // Invalidate cached list and notify listeners to refresh
          this.starterService.invalidateCacheAndRefresh()
          this.commonModalService.successPostingChallengeModal().then(() => {
            void this.router.navigate(['/ita-challenge/challenges']);
          });
        },
        error: (err) => {
          const errorMessage =
            err.error?.fieldErrors?.tags ||
            err.error?.message ||
            'Unexpected error occurred';

          if (err.error?.fieldErrors?.tags) {
            this.tagsControl.setErrors({ serverError: err.error.fieldErrors.tags });
          } else {
            this.commonModalService.errorPostingChallengeModal(errorMessage);
          }
        }
      });
    }
  }

  onTagSelect (idTag: string): void {
  const value = this.tagsControl.value || [];

  if (value.includes(idTag)) {
    this.tagsControl.setValue(value.filter((id: string) => id !== idTag));
  } else {
    this.tagsControl.setValue([...value, idTag]);
  }

  this.tagsControl.markAsTouched();
}

  isTagSelected (idTag: string): boolean {
    return this.tagsControl.value.includes(idTag);
  }

  private createEditorState(doc: string = this.challenge.solution): EditorState {
    const languageExtension = this.getLanguageExtension(this.challenge.language);
    return EditorState.create({
      doc: doc,
      extensions: [
        basicSetup,
        languageExtension(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            this.challenge.solution = update.state.doc.toString();
          }
        }),
        EditorView.theme({
          '&': {
            height: '300px'
          }
        })
      ]
    });
  }

onDeleteChallenge(): void {
  this.userRole$.pipe(
    take(1),
    switchMap((role) => {
      if (role !== 'ADMIN') {
        this.commonModalService.deleteErrorModal(
          this.translate.instant('challengeForm.deleteUnauthorized')
        );
        return of(null);
      }
      return from(this.commonModalService.deleteConfirmationModal());
    }),
    switchMap((result) => {
      if (!result?.isConfirmed) return of(null);
      return this.challengeService.deleteChallenge(this.challengeIdToEdit);
    })
  ).subscribe({
    next: (response) => {
      if (response === null) return;
      this.starterService.invalidateCacheAndRefresh();
      this.commonModalService.deleteSuccessModal().then(() => {
        void this.router.navigate(['/ita-challenge/challenges']);
      });
    },
    error: (err) => {
      this.commonModalService.deleteErrorModal(
        err?.message ?? this.translate.instant('challengeForm.deleteErrorMessage')
      );
    }
  });
}
}
