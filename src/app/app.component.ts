import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'ita-challenges'

  onLoginSuccess(success: boolean): void {
    if (success) {
      // Manejador centralizado de autenticación exitosa
      // Aunque esté sin nada actúa como punto de entrada para operaciones post-login
      // Se podría implementar navegación basada en roles (diferenciación mentor/usuario) y evitar así tantos booleanos en los htmls

      // Casos de uso potenciales:
      // - Actualizar estado global de autenticación
      // - Navegar a dashboards específicos por rol
      // - Refrescar componentes de UI
    }
  }
}
