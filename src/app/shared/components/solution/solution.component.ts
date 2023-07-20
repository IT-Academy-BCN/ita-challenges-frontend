import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { php } from '@codemirror/lang-php';
import { basicSetup, minimalSetup } from 'codemirror';
import { SendSolutionService } from 'src/app/services/send-solution.service';

type Language = 'javascript' | 'java' | 'python' | 'php';

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss']
})
export class SolutionComponent {
  @ViewChild('editorSolution') editorSolution!: ElementRef;
  editor: any;

  @Input() set number(value: number | undefined) {
  setTimeout(() => {
    this._number = value;
  }, 0);
}
get number() {
  return this._number;
}
  private _number?: number;
  @Input() languageExt: Language = 'javascript';

  @Input() isUserSolution = false;

  constructor(private solutionService: SendSolutionService) { }

  ngOnInit(): void {
    this.solutionService.obs$.subscribe(res => {
      if (this.editor && this.isUserSolution) {
        this.solutionService.sendSolutionToBackend(this.editor.state.doc.toString());
      }
    });
  }

  ngAfterViewInit() {
    this.createEditor();
  }

  createEditor() {
    let languageExtension;
    let comment: string = '// Escribe aquí tu código';
    switch (this.languageExt) {
      case 'javascript':
        languageExtension = javascript({typescript:true});
        console.log("Selected language: javascript (typescript)");
        break;
      case 'python':
        languageExtension = python();
        comment = '# Escribe aquí tu código';
        console.log("Selected language: python");
        break;
      case 'java':
        languageExtension = java();
        console.log("Selected language: java");
        break;
      case 'php':
        languageExtension = php();
        comment = '/* Escribe aquí tu código */';
        console.log("Selected language: php");
        break;
      default:
        console.error(`Unsupported language: ${this.languageExt}`);
        return;
    }

    let state: EditorState;
    if (this.isUserSolution){
      state = EditorState.create({
        doc: comment,
        extensions: [
          minimalSetup,
          languageExtension
        ]
      });
    }else{
      state = EditorState.create({
      doc: 'Respuesta de ejemplo, no se puede modificar',
      extensions: [
        minimalSetup,
        languageExtension,
        EditorView.editable.of(false)
      ]
    });
  }
    this.editor = new EditorView({ state, parent: this.editorSolution.nativeElement });
  }

}