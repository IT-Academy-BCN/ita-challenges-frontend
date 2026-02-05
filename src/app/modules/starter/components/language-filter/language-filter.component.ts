import { Component, EventEmitter, Output, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Language } from "src/app/models/language.model";
import { ChallengeFormService } from "src/app/services/challenge-form.service";
import { ChallengeService } from "src/app/services/challenge.service";

@Component({
  selector: "app-language-filter",
  templateUrl: "./language-filter.component.html",
  styleUrl: "./language-filter.component.css",
})
export class LanguageFilterComponent implements OnInit {
  
  mockLanguages: Language[] = [
    { id_language: "1", language_name: "JavaScript" },
    { id_language: "2", language_name: "Python" },
    { id_language: "3", language_name: "Java" },
    { id_language: "4", language_name: "PHP" },
  ];
  

  languages: Language[] = this.mockLanguages;
  @Output() languageSelected = new EventEmitter<string[]>();
  
  languageForm: FormGroup;
 
  constructor(
    private readonly challengeService: ChallengeFormService,
    private readonly fb: FormBuilder
  ) {
    this.languageForm = this.createFormFromLanguages(this.mockLanguages);
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
      controls[language.language_name.toLowerCase()] = new FormControl(false);
    });
    
    const form = this.fb.group(controls);
    

    form.valueChanges.subscribe(() => {

      this.emitSelectedLanguages(form);
    });
    
    return form;
  }

  emitSelectedLanguages(form: FormGroup): void {
    const selectedLanguages = Object.keys(form.value)
      .filter(key => form.value[key] === true);
    
    this.languageSelected.emit(selectedLanguages);
    console.log('event emitted', selectedLanguages)
  }
}