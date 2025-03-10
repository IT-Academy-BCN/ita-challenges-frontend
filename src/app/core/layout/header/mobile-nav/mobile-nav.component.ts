import { Component, Inject } from '@angular/core'
import { NavService } from 'src/app/services/nav.service'

@Component({
  selector: 'app-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrl: './mobile-nav.component.scss'
})
export class MobileNavComponent {
  constructor (@Inject(NavService) public navService: NavService) {}

  changeLanguage (event: Event): void {
    const selectElement = event.target as HTMLSelectElement
    const language = selectElement.value
    this.navService.changeLanguage(language)
  }
}
