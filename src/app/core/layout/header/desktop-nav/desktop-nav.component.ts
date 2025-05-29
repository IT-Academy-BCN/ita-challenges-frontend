import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NavService } from 'src/app/services/nav.service'; 
import { ToggleComponent } from 'src/app/shared/components/toggle/toggle.component';

@Component({
  selector: 'app-desktop-nav',
  templateUrl: './desktop-nav.component.html',
  styleUrl: './desktop-nav.component.scss'
})

export class DesktopNavComponent implements OnInit, OnDestroy{
  isLoggedIn = false;
  dropdownOpen: boolean = false;
  user: string = '';
  private authSubscription!: Subscription;
  currentRole: string = ''
  newRole: 'ADMIN' | 'USER' = 'ADMIN'


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

  logout(): void {
    this._authService.logout()
  }
  onSwitchRole (newRole: 'ADMIN' | 'USER'): void {
    console.log('new role: ', newRole)
    this._authService.switchRole(newRole).subscribe({
      next: (data) => {
        console.log('changing role successfully', data)
      },
      error: (error) => {
        console.log('error changing your role', error)
      }
    })
  }
}
