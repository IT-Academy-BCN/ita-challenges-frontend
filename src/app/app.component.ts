import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'ita-challenges'

  isLoggedIn:boolean = false

  onLoginSuccess(success: boolean): void {
    if (success) {
      this.isLoggedIn = success
    }
  }
}
