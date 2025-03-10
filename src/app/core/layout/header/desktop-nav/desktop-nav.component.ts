import { Component, Inject } from '@angular/core'
import { NavService } from 'src/app/services/nav.service'

@Component({
  selector: 'app-desktop-nav',
  templateUrl: './desktop-nav.component.html',
  styleUrl: './desktop-nav.component.scss'
})
export class DesktopNavComponent {
  constructor (@Inject(NavService) public navService: NavService) {}

  changeLanguage (event: Event): void {
    const selectElement = event.target as HTMLSelectElement
    const language = selectElement.value
    this.navService.changeLanguage(language)
  }
}
