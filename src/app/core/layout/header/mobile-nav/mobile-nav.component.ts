import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { AuthService } from 'src/app/services/auth.service'
import { NavService } from 'src/app/services/nav.service'

@Component({
  selector: 'app-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrl: './mobile-nav.component.scss'
})
export class MobileNavComponent implements OnInit, OnDestroy{
  isLoggedIn = false;
  dropdownOpen: boolean = false;
  user: string = '';
  currentRole: string = ''
  private authSubscription!: Subscription;


  constructor(
    @Inject(NavService) public navService: NavService,
    @Inject(AuthService) private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this._authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    this._authService.updateUserRoleAndUserNameFromToken();
    this._authService.getUsername().subscribe((username) => {
      this.user = username;
    });

    this._authService.getUserRole().subscribe((userRole) => {
      this.currentRole = userRole
    })
    this._authService.checkAndHandleExpiredToken()
  }

    ngOnDestroy(): void {
      if (this.authSubscription) {
        this.authSubscription.unsubscribe();
      }
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

  logout(): void {
    this._authService.logout()
  }

  onSwitchRole (newRole: 'ADMIN' | 'USER'): void {
    console.log('new role: ', newRole)
    this._authService.switchRole(newRole).subscribe({
      next: (data) => {
        localStorage.setItem('authToken', data.token)
        this._authService.updateUserRoleAndUserNameFromToken()
      },
      error: (error) => {
        console.log('error changing your role', error)
      }
    })
  }
}
