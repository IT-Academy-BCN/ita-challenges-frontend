import {
  Component,
  type ElementRef,
  Input,
  ViewChild,
  inject,
  type OnInit
} from '@angular/core'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { java } from '@codemirror/lang-java'
import { javascript } from '@codemirror/lang-javascript'
import { minimalSetup } from 'codemirror'
import { php } from '@codemirror/lang-php'
import { python } from '@codemirror/lang-python'

import { SolutionService } from 'src/app/services/solution.service'
import { type SolutionResults } from 'src/app/models/solution-results.model'

type Language = 'javascript' | 'java' | 'python' | 'php'

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss']
})
export class SolutionComponent implements OnInit {
  @ViewChild('editorSolution') editorSolution!: ElementRef

  @Input() challengeSolutions: SolutionResults[] = []
  @Input() solution_text: string = ''
  @Input() languageExt: Language = 'javascript'
  @Input() isUserSolution = false

  @Input() set number (value: number | undefined) {
    setTimeout(() => {
      this._number = value
    }, 0)
  }

  get number (): number | undefined {
    return this._number
  }

  private _number?: number

  public editor: EditorView = new EditorView()
  public currentSolution: string = ''
  public solutions: any[] = []

  private textRemoved = false

  private readonly solutionService = inject(SolutionService)
  private lastSentSolution: string = ''

  ngOnInit (): void {
    this.solutionService.solutionSent$.subscribe((value) => {
      if (value && this.isUserSolution) {
        const currentSolution = this.editor.state.doc.toString()
        if (currentSolution !== this.lastSentSolution) {
          this.solutionService.sendSolution(currentSolution)
          this.lastSentSolution = currentSolution
        }
      }
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
        // doc: comment,
        extensions: [minimalSetup, languageExtension]
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
    this.editor = new EditorView({
      state,
      parent: this.editorSolution.nativeElement
    })
  }
}
