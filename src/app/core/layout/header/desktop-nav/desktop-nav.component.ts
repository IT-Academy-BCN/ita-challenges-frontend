import { Component, HostListener, Inject, OnInit } from '@angular/core'
import { NavService } from 'src/app/services/nav.service'

@Component({
  selector: 'app-desktop-nav',
  templateUrl: './desktop-nav.component.html',
  styleUrl: './desktop-nav.component.scss'
})
export class DesktopNavComponent implements OnInit{
  isLoggedIn = false
  dropdownOpen: boolean = false
  user: string = ''

  constructor (@Inject(NavService) public navService: NavService) {
    this.isLoggedIn = !(localStorage.getItem('authToken') == null)
  }

  ngOnInit(): void {
    this.getUserFromLocalStorage()
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

  getUserFromLocalStorage (): void {
    const username = localStorage.getItem('username');
    console.log('Username from localStorage:', username);
    this.user = username || '';
  }
}
