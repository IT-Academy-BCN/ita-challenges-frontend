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
  createEditor() {
    let languageExtension;

    switch (this.languageExt) {
      case 'javascript':
        languageExtension = javascript({typescript:true});
        break;
      case 'python':
        languageExtension = python();
        break;
      case 'java':
        languageExtension = java();
        break;
      case 'php':
        languageExtension = php();
        break;
      default:
        return;
    }

    let state: EditorState;
    if (this.isUserSolution){
      state = EditorState.create({
        //doc: comment,
        extensions: [
          minimalSetup,
          languageExtension
        ]
      });
    }else{
      state = EditorState.create({
      // doc: 'Respuesta de ejemplo, no se puede modificar',
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