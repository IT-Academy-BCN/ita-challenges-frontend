import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent { 
  constructor( private translate: TranslateService) {
    translate.addLangs(['en', 'es', 'cat']);
    translate.setDefaultLang('es');
    translate.use('es');  
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
  }
}
