import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Language } from 'src/app/models/language.model';
import { ChallengeService } from 'src/app/services/challenge.service';

@Component({
  selector: 'app-language-filter',
  templateUrl: './language-filter.component.html',
  styleUrl: './language-filter.component.css'
})


export class LanguageFilterComponent {
  languages: Language[] = [];
  mockLanguages: Language[] = [
    { id_language: '1', language_name: 'JavaScript' },
    { id_language: '2', language_name: 'Python' },
    { id_language: '3', language_name: 'Java' },
    { id_language: '4', language_name: 'PHP' }
  ];

  constructor(readonly challengeService: ChallengeService) {
    this.challengeService.getAllLanguages().subscribe((res: any) => {
      if (res.results !== undefined && res.status === 200) {
        this.languages = res.results 
      }  else {
        this.languages = this.mockLanguages
      }  
      });
  }

}
