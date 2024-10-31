import { Component } from '@angular/core';
import { NavService } from 'src/app/services/nav.service';
@Component({
  selector: 'app-desktop-nav',
  templateUrl: './desktop-nav.component.html',
  styleUrl: './desktop-nav.component.scss'
})
export class DesktopNavComponent {
  constructor(public navService: NavService) {}

  openLoginModal(): void {
    this.navService.openLoginModal();
  }

  changeLanguage(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const language = selectElement.value;
    this.navService.changeLanguage(language);
  }
}