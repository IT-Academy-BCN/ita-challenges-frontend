import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service'
import { NavService } from 'src/app/services/nav.service'

@Component({
  selector: 'app-desktop-nav',
  templateUrl: './desktop-nav.component.html',
  styleUrl: './desktop-nav.component.scss'
})
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
      // Cancelar la suscripción para evitar fugas de memoria
      if (this.authSubscription) {
        this.authSubscription.unsubscribe();
      }
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
