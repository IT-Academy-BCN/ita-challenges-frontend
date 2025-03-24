import { Component, Inject } from '@angular/core'
import { NavService } from 'src/app/services/nav.service'

@Component({
  selector: 'app-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrl: './mobile-nav.component.scss'
})
export class MobileNavComponent {
  isLoggedIn = false

  constructor (@Inject(NavService) public navService: NavService) {
    this.isLoggedIn = !(localStorage.getItem('authToken') == null)
  }

  changeLanguage (event: Event): void {
    const selectElement = event.target as HTMLSelectElement
    const language = selectElement.value
    this.navService.changeLanguage(language)
  }

  onLoginSuccess (isLogged: boolean): void {
    this.isLoggedIn = isLogged
  }
}
