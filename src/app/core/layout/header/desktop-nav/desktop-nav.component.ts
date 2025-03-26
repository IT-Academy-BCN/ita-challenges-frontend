import { Component, Inject, OnInit } from '@angular/core'
import { AuthService } from 'src/app/services/auth.service'
import { NavService } from 'src/app/services/nav.service'

@Component({
  selector: 'app-desktop-nav',
  templateUrl: './desktop-nav.component.html',
  styleUrl: './desktop-nav.component.scss'
})
export class DesktopNavComponent implements OnInit{
  isLoggedIn = false

  constructor (
    @Inject(NavService) public navService: NavService,
    @Inject(AuthService) private _authService: AuthService) {}

    ngOnInit(): void {
      this.isLoggedIn = this._authService.isUserLoggedIn();
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
