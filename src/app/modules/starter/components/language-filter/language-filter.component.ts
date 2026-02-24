import { Component, EventEmitter, Output, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Language } from "src/app/models/language.model";
import { ChallengeFormService } from "src/app/services/challenge-form.service";

export const mockLanguages: Language[] = [
  { id_language: "1", language_name: "JavaScript" },
  { id_language: "2", language_name: "Python" },
  { id_language: "3", language_name: "Java" },
  { id_language: "4", language_name: "PHP" },
];

@Component({
  selector: "app-language-filter",
  templateUrl: "./language-filter.component.html",
  styleUrl: "./language-filter.component.scss",
})

export class LanguageFilterComponent implements OnInit {

  languages: Language[] = mockLanguages;
  @Output() languageSelected = new EventEmitter<string[]>();
  
  languageForm: FormGroup;
 
  private languageNameToIdMap: Record<string, string> = {};
  constructor(
    private readonly challengeService: ChallengeFormService,
    private readonly fb: FormBuilder
  ) {
    this.languageForm = this.createFormFromLanguages(mockLanguages);
  }

  ngOnInit(): void {
    this.loadLanguages();
  }

  loadLanguages(): void {
    this.challengeService.getAllLangugesCreateForm().subscribe({
      next: (res: any) => {
        if (res.results !== null && res.results.length > 0) {
          this.languages = res.results;
          this.languageForm = this.createFormFromLanguages(res.results);
        }
      },
      error: (err) => {
        console.error('Error Fetching languages, using mocking data:', err);
      }   
    });
  }

  createFormFromLanguages(languages: Language[]): FormGroup {
    const controls: { [key: string]: FormControl } = {};
    
    languages.forEach((language) => {
    const key = language.language_name.toLowerCase();
      controls[key] = new FormControl(false);
      this.languageNameToIdMap[key] = language.id_language;
    });
    const form = this.fb.group(controls);
    form.valueChanges.subscribe(() => {
      this.emitSelectedLanguages(form);
    });

    
    return form;
  }

  emitSelectedLanguages(form: FormGroup): void {
    const selectedLanguages = Object.keys(form.value)
      .filter(key => form.value[key] === true)
      .map(key => this.languageNameToIdMap[key]);
    
    this.languageSelected.emit(selectedLanguages);
  }

}