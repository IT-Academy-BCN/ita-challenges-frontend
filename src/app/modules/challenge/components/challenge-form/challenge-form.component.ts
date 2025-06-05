import { Component, inject, ViewChild, type ElementRef, type AfterViewInit, type OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { ChallengeService } from 'src/app/services/challenge.service'
import { type CreateChallenge } from '../../../../models/create-challenge.interface'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { type Language } from 'src/app/models/challenges.interface'
import { ChallengeFormService } from '../../../../services/challenge-form.service'
import { EditorModule } from '@tinymce/tinymce-angular'

import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { Inject } from '@angular/core'

// Imports para CodeMirror
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { java } from '@codemirror/lang-java'
import { python } from '@codemirror/lang-python'
import { basicSetup } from 'codemirror'

import { type TagResponse } from 'src/app/models/tag-response.interface'

@Component({
  standalone: true,
  selector: 'app-challenge-form',
  templateUrl: './challenge-form.component.html',
  styleUrls: ['./challenge-form.component.scss'],
  imports: [FormsModule, CommonModule, EditorModule, TranslateModule]
})
export class ChallengeFormComponent implements AfterViewInit, OnDestroy {
  @ViewChild('codeMirrorEditor') codeMirrorEditor!: ElementRef

  public editor: EditorView | null = null

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
  selectedTags: string[] = []
  currentTags: any[] = []

  editorConfig = {
    base_url: '/assets/tinymce',
    suffix: '.min',
    height: 260,
    menubar: false,
    branding: false,
    elementpath: false,
    statusbar: true,
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
  private readonly router = inject(Router)

  constructor (
    @Inject(TranslateService) readonly translate: TranslateService
  ) {
    this.loadLanguages()
    translate.addLangs(['en', 'es', 'ca'])
    translate.setDefaultLang('es')
    translate.use('es')
  }

  // Método que se ejecuta cuando el componente está listo
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  ngAfterViewInit (): void {
    this.initCodeMirror()
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
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!this.codeMirrorEditor?.nativeElement) return

    const languageExtension = this.getLanguageExtension(this.challenge.language)

    this.editor = new EditorView({
      parent: this.codeMirrorEditor.nativeElement,
      state: EditorState.create({
        doc: this.challenge.solution,
        extensions: [
          basicSetup,
          languageExtension(),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              this.challenge.solution = update.state.doc.toString()
            }
          }),
          EditorView.theme({
            '&': {
              height: '300px'
            }
          })
        ]
      })
    })
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
        console.error('Error al obtener los idiomas:', err)
        this.languages = []
      }
    })
  }

  onLanguageChange (language: string): void {
    this.challenge.language = language
    const selectedLang = this.languages.find(lang => lang.language_name === language)
    this.selectedLanguageId = (selectedLang != null) ? selectedLang.id_language : ''
    // Cargar los tags con el nuevo ID del lenguaje
    this.loadTags()
    /* istanbul ignore next */
    // Actualiza CodeMirror con el nuevo lenguaje
    if (this.editor != null) {
      const languageExtension = this.getLanguageExtension(language)
      this.editor.setState(EditorState.create({
        doc: this.editor.state.doc,
        extensions: [
          basicSetup,
          languageExtension(),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              this.challenge.solution = update.state.doc.toString()
            }
          })
        ]
      }))
    }
  }

  loadTags (): void {
    if (this.selectedLanguageId.length === 0) {
      console.warn('No language selected, skipping tag loading.')
      return
    }
    this.challengeFormService.getTagsByLanguage(this.selectedLanguageId).subscribe({
      next: (response: TagResponse) => {
        this.currentTags = response.results ?? []
        this.selectedTags = []
      },
      error: (error) => {
        console.error('Error al obtener las etiquetas:', error)
        this.currentTags = []
        this.selectedTags = []
      }
    })
  }

  // Validación del formulario (código original)
  public isFormValid (): boolean {
    const isLanguageValid = this.languages.some(lang =>
      lang.language_name === this.challenge.language
    )
    return (
      this.challenge.challengeTitle.trim() !== '' &&
      this.challenge.description.trim() !== '' &&
      isLanguageValid &&
      isLanguageValid &&
      this.challenge.solution.trim() !== ''
    )
  }

  onCancel (): void {
    // 🚀 TODO: En el futuro, cambiar esta redirección al dashboard del mentor
    void this.router.navigate(['/ita-challenge/challenges'])
  }

  // Envío del formulario (código original)
  onSubmit (): void {
    if (!this.isFormValid()) {
      console.error('El formulario no es válido')
      return
    }
    this.challenge.tags = [...this.selectedTags]
    this.challengeService.createChallenge(this.challenge).subscribe({
      next: (response) => {
        console.log('Reto creado:', response)
        // 🚀 TODO: En el futuro, cambiar esta redirección al dashboard del mentor
        void this.router.navigate(['/ita-challenge/challenges'])
      },
      error: (err) => {
        console.error('Error al crear el reto:', err)
      }
    })
  }

  onTagSelect (idTag: string): void {
    const index = this.selectedTags.indexOf(idTag)
    if (index === -1) {
      this.selectedTags.push(idTag)
    } else {
      this.selectedTags.splice(index, 1)
    }
  }

  isTagSelected (idTag: string): boolean {
    return this.selectedTags.includes(idTag)
  }
}
