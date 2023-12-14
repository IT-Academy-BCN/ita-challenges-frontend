import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { php } from '@codemirror/lang-php';
import { basicSetup, minimalSetup } from 'codemirror';
import { SolutionService } from '../../../services/solution.service';
import {TranslateService} from "@ngx-translate/core";
import { linter } from '@codemirror/lint';
import {  Diagnostic } from '@codemirror/lint';



type Language = 'javascript' | 'java' | 'python' | 'php';

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss']
})
export class SolutionComponent {
  @ViewChild('editor') private editorContainer!: ElementRef;
  private editor?: EditorView;
  @Input() languageExt: string = 'javascript';

  @Input() set number(value: number | undefined) {
  setTimeout(() => {
    this._number = value;
  }, 0);
}
get number() {
  return this._number;
}
  private _number?: number;

  @Input() isUserSolution = false;

/* code added by valerio */
  private textRemoved = false;

  handleClick(event: MouseEvent) {
    if (!this.textRemoved) {
      // Check if the text has not been removed yet
      const div = event.target as HTMLDivElement;
      div.textContent = ''; // Remove the text
      this.textRemoved = true; // Set the flag to indicate that the text has been removed
    }
  }

  constructor(private solutionService: SolutionService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    this.solutionService.obs$.subscribe(res => {
      if (this.editor && this.isUserSolution) {
        this.solutionService.sendSolution(this.editor.state.doc.toString());
      }
    });
  }

  ngAfterViewInit() {
    this.createEditor();
  }

  //nota para equipo front end : tuve que eliminar la variable comment porque sino el handleclick no me funcionaba
  private createEditor(): void {
    let extensions = [];

    if (this.languageExt === 'javascript') {
      extensions.push(javascript());
      // Aquí puedes agregar otras extensiones de CodeMirror necesarias para tu editor

      // Agrega el linter
      extensions.push(linter(myLinterFunction));
    }

    if(this.languageExt === 'java') {
      extensions.push(java());


      extensions.push(linter(myLinterFunction));

    }

    // Agrega configuraciones adicionales para otros lenguajes aquí

    this.editor = new EditorView({
      state: EditorState.create({
        extensions: extensions
      }),
      parent: this.editorContainer.nativeElement
    });
  }

}


type Severity = 'error' | 'warning' | 'info'; // Define expected severity values


function myLinterFunction(view: EditorView): Diagnostic[] {
  let diagnostics: Diagnostic[] = [];
  const doc = view.state.doc;

  for (let lineNumber = 0; lineNumber < doc.lines; lineNumber++) {
    const line = doc.line(lineNumber + 1);

    const varIndex = line.text.indexOf('var');
    if (varIndex !== -1) {
      diagnostics.push({
        from: line.from + varIndex,
        to: line.from + varIndex + 3,
        severity: 'warning' as Severity, // Use the Severity type
        message: "Evita usar 'var'; usa 'let' o 'const' en su lugar."
      });
    }
  }

  return diagnostics;
}




