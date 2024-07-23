import {
  Component,
  type ElementRef,
  Input,
  ViewChild,
  inject
} from '@angular/core'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { java } from '@codemirror/lang-java'
import { javascript } from '@codemirror/lang-javascript'
import { minimalSetup } from 'codemirror'
import { php } from '@codemirror/lang-php'
import { python } from '@codemirror/lang-python'

import { SolutionService } from 'src/app/services/solution.service'

type Language = 'javascript' | 'java' | 'python' | 'php'

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss']
})
export class SolutionComponent {
  @ViewChild('editorSolution') editorSolution!: ElementRef

  private _number?: number
  get number (): number | undefined {
    return this._number
  }

  @Input() set number (value: number | undefined) {
    setTimeout(() => {
      this._number = value
    }, 0)
  }

  @Input() languageExt: Language = 'javascript'
  @Input() isUserSolution = false

  public editor: EditorView = new EditorView()
  public currentSolution: string = ''
  public solutions: any[] = []

  private textRemoved = false
  private readonly solutionService = inject(SolutionService)
  private lastSentSolution: string = ''

  ngOnInit (): void {
    this.solutionService.solutionSent$.subscribe((value) => {
      // if (this.editor && this.isUserSolution) {
      this.currentSolution = this.editor.state.doc.toString()
      if (this.currentSolution !== this.lastSentSolution) {
        this.solutionService.sendSolution(this.currentSolution)
        this.lastSentSolution = this.currentSolution
      }
      // }
    })
    this.solutionService
      .getSolutions('../assets/dummy/challenge.json')
      .subscribe((data) => {
        this.solutions = data.solutions
      })
    this.solutionService.sendSolutionText$.subscribe(() => {
      this.onSubmitSolution()
    })
  }

  ngAfterViewInit (): void {
    this.createEditor()
  }

  handleClick (event: MouseEvent): void {
    if (!this.textRemoved) {
      // Check if the text has not been removed yet
      const div = event.target as HTMLDivElement
      div.textContent = '' // Remove the text
      this.textRemoved = true // Set the flag to indicate that the text has been removed
    }
  }

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
        doc: '',
        extensions: [minimalSetup, languageExtension]
      })
    } else {
      state = EditorState.create({
        doc: 'Respuesta de ejemplo, no se puede modificar',
        extensions: [
          minimalSetup,
          languageExtension,
          EditorView.editable.of(false)
        ]
      })
    }
    this.editor = new EditorView({
      state,
      parent: this.editorSolution.nativeElement
    })
  }

  onSubmitSolution (): void {
    console.log('Solution submitted:', this.editor.state.doc.toString())
  }
}
