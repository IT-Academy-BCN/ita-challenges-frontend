import { Component, OnInit, type OnDestroy, type OnChanges, type SimpleChanges, ViewChild, ElementRef, ChangeDetectorRef, inject, Input } from '@angular/core'
import { EditorView, keymap, type ViewUpdate } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { basicSetup } from 'codemirror'
import { defaultKeymap } from '@codemirror/commands'
import { lineNumbers } from '@codemirror/view'

@Component({
  selector: 'app-editor-challenge',
  templateUrl: './editor-challenge.component.html',
  styleUrls: ['./editor-challenge.component.scss']
})
export class editorChallengeComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('editorSolution', { static: false }) editorSolution!: ElementRef
  @Input() showEditor: boolean = false
  @Input() initialContent: string = '// Escribe tu solución aquí'
  @Input() activeId: number = 1

  private editor!: EditorView
  private readonly cdr = inject(ChangeDetectorRef)

  ngOnInit (): void {
    if (this.showEditor) {
      this.initializeCodeMirror()
    }
  }

  ngOnDestroy (): void {
    this.editor?.destroy()
  }

  ngOnChanges (changes: SimpleChanges): void {
    if (changes['showEditor']?.currentValue === true && this.editor == null) {
      this.cdr.detectChanges() 
      this.initializeCodeMirror()
    }
  }

  ngAfterViewInit (): void {
    if (this.showEditor && this.editorSolution !== null && this.editorSolution !== undefined) {
      this.initializeCodeMirror()
    }
  }

  initializeCodeMirror (): void {
    let savedContent = localStorage.getItem('editorContent')?.trim() ?? ''

    if (savedContent.trim() === '') {
      savedContent = '// Escriu la teva solució aquí\n' + '\n'.repeat(6)
    }

    // Imprimir en consola el contenido antes de inicializar el editor
    console.log('Contenido recuperado:', savedContent)

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
  }

  saveContent (): void {
    const content = this.editor.state.doc.toString()
    localStorage.setItem('editorContent', content)
  }
}
