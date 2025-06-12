import { Component, OnInit, type OnDestroy, type OnChanges, type SimpleChanges, ViewChild, ElementRef, ChangeDetectorRef, inject, Input } from '@angular/core'
import { EditorView, keymap, type ViewUpdate } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { basicSetup } from 'codemirror'
import { defaultKeymap } from '@codemirror/commands'
import { lineNumbers } from '@codemirror/view'
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum'

@Component({
  selector: 'app-editor-challenge',
  templateUrl: './editor-challenge.component.html',
  styleUrls: ['./editor-challenge.component.scss']
})
export class editorChallengeComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('editorSolution', { static: false }) editorSolution!: ElementRef
  @Input() isEditorChallengeVisible: boolean = false
  @Input() initialContent: string = '// Escribe tu solución aquí'
  @Input() activeId: ChallengeTab = ChallengeTab.DETAILS

  private editor!: EditorView
  private readonly cdr = inject(ChangeDetectorRef)
  private isEditorInitialized: boolean = false

  ngOnInit (): void {
    if (this.isEditorChallengeVisible) {
      this.initializeCodeMirror()
    }
  }

  ngOnDestroy (): void {
    this.editor?.destroy()
  }

  ngOnChanges (changes: SimpleChanges): void {
    if (changes['isEditorChallengeVisible']?.currentValue === true && this.editor == null) {
      this.cdr.detectChanges() 
      this.initializeCodeMirror()
    }
  }

  ngAfterViewInit (): void {
    if (this.isEditorChallengeVisible && this.editorSolution !== null && this.editorSolution !== undefined) {
      this.initializeCodeMirror()
    }
  }

  initializeCodeMirror (): void {
    if (this.isEditorInitialized) return

    const savedContent = '// Escriu la teva solució aquí\n'

    this.editor = new EditorView({
      parent: this.editorSolution.nativeElement,
      state: EditorState.create({
        doc: savedContent,
        extensions: [
          basicSetup, // Configuración básica
          javascript(), // Soporte para JavaScript
          keymap.of(defaultKeymap), // Atajos de teclado
          lineNumbers(), // Habilitar números de línea
          EditorView.updateListener.of((update: ViewUpdate) => {
            if (update.docChanged) {
              const content = this.editor.state.doc.toString()
              localStorage.setItem('editorContent', content)
            }
          }),
          EditorView.editable.of(true) // Habilita edición
        ]
      })
    })
    this.isEditorInitialized = true
  }

  saveContent (): void {
    const content = this.editor.state.doc.toString()
    localStorage.setItem('editorContent', content)
  }
}
