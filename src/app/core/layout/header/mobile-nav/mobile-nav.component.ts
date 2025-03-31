import { Component, HostListener, Inject, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { AuthService } from 'src/app/services/auth.service'
import { NavService } from 'src/app/services/nav.service'

@Component({
  selector: 'app-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrl: './mobile-nav.component.scss'
})
export class MobileNavComponent implements OnInit{
  isLoggedIn = false
  dropdownOpen: boolean = false
  user: string = ''

  constructor (@Inject(NavService) public navService: NavService,
              @Inject(AuthService) private _authService: AuthService) {
    this.isLoggedIn = !(localStorage.getItem('authToken') == null)
  }

  ngOnInit(): void {
    this._authService.updateUserRoleFromToken();
    this._authService.getUsername().subscribe((username) => {
      this.user = username;
    });
  }

  changeLanguage (event: Event): void {
    const selectElement = event.target as HTMLSelectElement
    const language = selectElement.value
    this.navService.changeLanguage(language)
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

      @HostListener('document:click', ['$event'])
      onClickOutside(event: MouseEvent) {
        const dropdown = document.querySelector('.dropdown-mobile');
        const userButton = document.querySelector('.user-mobile');
    
        if (
          !dropdown?.contains(event.target as Node) &&
          !userButton?.contains(event.target as Node)
        ) {
          this.dropdownOpen = false;
        }
      }

  onLoginSuccess (isLogged: boolean): void {
    this.isLoggedIn = isLogged
  }
}
