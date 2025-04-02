<<<<<<< HEAD
import { Component, HostListener, Inject, OnInit } from '@angular/core'
=======
import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs';
>>>>>>> develop
import { AuthService } from 'src/app/services/auth.service'
import { NavService } from 'src/app/services/nav.service'

@Component({
  selector: 'app-desktop-nav',
  templateUrl: './desktop-nav.component.html',
  styleUrl: './desktop-nav.component.scss'
})
<<<<<<< HEAD
export class DesktopNavComponent implements OnInit{
  isLoggedIn = false
  dropdownOpen: boolean = false
  user: string = ''

  constructor (@Inject(NavService) public navService: NavService,
              @Inject(AuthService) private _authService: AuthService) {
    this.isLoggedIn = !(localStorage.getItem('authToken') == null)
  }
=======
export class DesktopNavComponent implements OnInit, OnDestroy{
  isLoggedIn = false
  private authSubscription!: Subscription;

  constructor (
    @Inject(NavService) public navService: NavService,
    @Inject(AuthService) private _authService: AuthService) {}

    ngOnInit(): void {
      this.authSubscription = this._authService.isLoggedIn$.subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      });
    }

    ngOnDestroy(): void {
      if (this.authSubscription) {
        this.authSubscription.unsubscribe();
      }
    }
>>>>>>> develop

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
      const dropdown = document.querySelector('.dropdown');
      const userButton = document.querySelector('.user');
  
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
