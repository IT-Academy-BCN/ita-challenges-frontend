import { Component, inject, ViewChild, type ElementRef, type AfterViewInit, type OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { ChallengeService } from 'src/app/services/challenge.service'
import { type CreateChallenge } from '../../../../models/create-challenge.interface'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { type Language } from 'src/app/models/challenges.interface'
import { ChallengeFormService } from '../../../../services/challenge-form.service'
import { EditorModule } from '@tinymce/tinymce-angular'

// Imports para CodeMirror
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { java } from '@codemirror/lang-java'
import { python } from '@codemirror/lang-python'
import { basicSetup } from 'codemirror'

@Component({
  standalone: true,
  selector: 'app-challenge-form',
  templateUrl: './challenge-form.component.html',
  styleUrls: ['./challenge-form.component.scss'],
  imports: [FormsModule, CommonModule, EditorModule]
})
export class ChallengeFormComponent implements AfterViewInit, OnDestroy {
  @ViewChild('codeMirrorEditor') codeMirrorEditor!: ElementRef

  private editor: EditorView | null = null

  challenge: CreateChallenge = {
    challengeTitle: '',
    description: '',
    level: 'EASY',
    language: '' as 'Java' | 'PHP' | 'Python' | 'Javascript' | 'Typescript' | 'SQL',
    solution: ''
  }

  languages: Language[] = []

  editorConfig = {
    base_url: '/assets/tinymce',
    suffix: '.min',
    height: 300,
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

  constructor () {
    this.loadLanguages()
  }

  // Método que se ejecuta cuando el componente está listo
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  ngAfterViewInit () {
    this.initCodeMirror()
  }

  // Método que se ejecuta cuando el componente se destruye
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  ngOnDestroy () {
    if (this.editor != null) {
      this.editor.destroy()
    }
  }

  // Inicializa el editor CodeMirror
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private initCodeMirror () {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!this.codeMirrorEditor) return

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

  // Carga los lenguajes del backend (código de Yana)
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  loadLanguages () {
    this.challengeFormService.getAllLangugesCreateForm().subscribe({
      // eslint-disable-next-line no-return-assign, @typescript-eslint/strict-boolean-expressions
      next: ({ results }) => this.languages = results || [],
      error: (err) => {
        console.error('Error al obtener los idiomas:', err)
        this.languages = []
      }
    })
  }

  // Nuevo método para manejar el cambio de lenguaje
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  onLanguageChange (language: string) {
    // Actualiza el lenguaje en el modelo (lo que hacía el código de Yana)
    this.challenge.language = language

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

  // Validación del formulario (código original)
  public isFormValid (): boolean {
    const isLanguageValid = this.languages.some(lang =>
      lang.language_name === this.challenge.language
    )
    return (
      this.challenge.challengeTitle.trim() !== '' &&
      this.challenge.description.trim() !== '' &&
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
}
