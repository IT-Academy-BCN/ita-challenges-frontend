import { Component, OnInit, type OnDestroy, type OnChanges, type SimpleChanges, ViewChild, ElementRef, ChangeDetectorRef, inject, Input, EventEmitter, Output } from '@angular/core'
import { EditorView, keymap, type ViewUpdate } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { basicSetup } from 'codemirror'
import { defaultKeymap } from '@codemirror/commands'
import { lineNumbers } from '@codemirror/view'
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { SolutionService } from 'src/app/services/solution.service'

@Component({
  selector: 'app-editor-challenge',
  templateUrl: './editor-challenge.component.html',
  styleUrls: ['./editor-challenge.component.scss']
})
export class EditorChallengeComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('editorSolution', { static: false }) editorSolution!: ElementRef
  @Input() isEditorChallengeVisible: boolean = false
  @Input() initialContent: string = '// Escribe tu solución aquí'
  @Input() activeId: ChallengeTab = ChallengeTab.DETAILS
  @Input() idChallenge!: string;
  @Input() languageId!: string;
  @Input() solutionText: string = '';
  @Output() solutionChanged = new EventEmitter<string>();


  private editor!: EditorView
  private readonly cdr = inject(ChangeDetectorRef)
  private isEditorInitialized: boolean = false
  private langChangeSub?: Subscription
  private readonly solutionService = inject(SolutionService);

  constructor (private readonly translate: TranslateService) {}
  ngOnInit (): void {
    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      this.updateEditorContent()
    })

    if (this.isEditorChallengeVisible) {
      this.initializeCodeMirror()
    }
  }

  ngOnDestroy (): void {
    this.editor?.destroy()
    this.langChangeSub?.unsubscribe()
  }

ngOnChanges(changes: SimpleChanges): void {
  if (changes['isEditorChallengeVisible']?.currentValue === true && !this.editor) {
    this.cdr.detectChanges();
    this.initializeCodeMirror();
  }
  if (changes['solutionText'] && this.editor) {
    const newText = changes['solutionText'].currentValue || '';
    this.editor.dispatch({
      changes: { from: 0, to: this.editor.state.doc.length, insert: newText }
    });
  }
  if (changes['initialContent'] && this.editor) {
    const newText = changes['initialContent'].currentValue || '';
    this.editor.dispatch({
      changes: { from: 0, to: this.editor.state.doc.length, insert: newText }
    });
  }
}


  ngAfterViewInit (): void {
    if (this.isEditorChallengeVisible && this.editorSolution !== null && this.editorSolution !== undefined) {
      this.initializeCodeMirror()
    }
  }

  initializeCodeMirror (): void {
    if (this.isEditorInitialized) return

    this.translate.get('modules.challenge.info.solutionCode').subscribe((translatedText: string) => {
      const savedContent = translatedText + '\n'

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
                 this.solutionChanged.emit(content); 
                this.solutionService.solutionText(content); 
              }
            }),
            EditorView.editable.of(true) // Habilita edición
          ]
        })
      })
      this.isEditorInitialized = true
    })
  }
  updateEditorContent (): void {
    this.translate.get('modules.challenge.info.solutionCode').subscribe(translatedText => {
      const content = translatedText + '\n'
      this.editor.dispatch({
        changes: { from: 0, to: this.editor.state.doc.length, insert: content }
      })
    })
 
 }
 onEditorContentChange(content: string): void {
  this.solutionChanged.emit(content);
}
}
