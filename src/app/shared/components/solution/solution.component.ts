import { Component, type ElementRef, Input, ViewChild, inject } from '@angular/core'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { php } from '@codemirror/lang-php'
import { minimalSetup } from 'codemirror'
import { TranslateService } from '@ngx-translate/core'
import { SolutionService } from 'src/app/services/solution.service'

type Language = 'javascript' | 'java' | 'python' | 'php'

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss']
})
export class SolutionComponent {
  @ViewChild('editorSolution') editorSolution!: ElementRef
  editor: EditorView = new EditorView()

  @Input() set number (value: number | undefined) {
    setTimeout(() => {
      this._number = value
    }, 0)
  }

  get number (): number | undefined {
    return this._number
  }

  private _number?: number
  @Input() languageExt: Language = 'javascript'

  @Input() isUserSolution = false

  /* code added by valerio */
  private textRemoved = false

  handleClick (event: MouseEvent): void {
    if (!this.textRemoved) {
      // Check if the text has not been removed yet
      const div = event.target as HTMLDivElement
      div.textContent = '' // Remove the text
      this.textRemoved = true // Set the flag to indicate that the text has been removed
    }
  }

  solutions: any[] = []

  private readonly solutionService = inject(SolutionService)
  private readonly translateService = inject(TranslateService)

  private lastSentSolution: string = ''

  ngOnInit (): void {
    this.solutionService.solutionSent$.subscribe((value) => {
      // if (this.editor && this.isUserSolution) {
      const currentSolution = this.editor.state.doc.toString()
      if (currentSolution !== this.lastSentSolution) {
        this.solutionService.sendSolution(currentSolution)
        this.lastSentSolution = currentSolution
      }
      // }
    })
    this.solutionService.getSolutions('../assets/dummy/challenge.json').subscribe(data => {
      this.solutions = data.solutions
    })
  }

  ngAfterViewInit (): void {
    this.createEditor()
  }

  // nota para equipo front end : tuve que eliminar la variable comment porque sino el handleclick no me funcionaba
  createEditor (): void {
    let languageExtension

    switch (this.languageExt) {
      case 'javascript':
        languageExtension = javascript({ typescript: true })
        break
      case 'python':
        languageExtension = python()
        break
      case 'java':
        languageExtension = java()
        break
      case 'php':
        languageExtension = php()
        break
      default:
        return
    }

    let state: EditorState
    if (this.isUserSolution) {
      state = EditorState.create({
        // doc: comment,
        extensions: [
          minimalSetup,
          languageExtension
        ]
      })
    } else {
      state = EditorState.create({
      // doc: 'Respuesta de ejemplo, no se puede modificar',
        extensions: [
          minimalSetup,
          languageExtension,
          EditorView.editable.of(false)
        ]
      })
    }
    this.editor = new EditorView({ state, parent: this.editorSolution.nativeElement })
  }
}
