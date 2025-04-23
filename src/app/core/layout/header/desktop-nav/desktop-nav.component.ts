import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NavService } from 'src/app/services/nav.service';

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


  constructor(
    @Inject(NavService) public navService: NavService,
    @Inject(AuthService) private _authService: AuthService
  ) {}

  ngOnInit(): void {
    // Mantener solo la suscripción al estado de login
    this.authSubscription = this._authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      
      // Solo si está logueado, obtener el username
      if (isLoggedIn) {
        this._authService.getUsername().subscribe((username) => {
          this.user = username;
        });
      }
    });
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
}
