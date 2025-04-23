import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'ita-challenges'

  onLoginSuccess(success: boolean): void {
    if (success) {
      // El login fue exitoso, podemos actualizar el estado de la aplicación si es necesario
      console.log('Login successful')
    }
  }
}
