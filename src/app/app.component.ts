import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'ita-challenges'

<<<<<<< HEAD
  isLoggedIn:boolean = false

  onLoginSuccess(success: boolean): void {
    if (success) {
      this.isLoggedIn = success
    }
  }
}
=======
  onLoginSuccess(success: boolean): void {
    if (success) {
      // El login fue exitoso, podemos actualizar el estado de la aplicación si es necesario
      console.log('Login successful')
    }
  }
}
>>>>>>> b044dc05 (feat(auth): centralizar componente de login en app.component)
