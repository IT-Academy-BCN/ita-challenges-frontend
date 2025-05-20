import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss'
})
export class ToggleComponent {
  @Input() currentRole: string = ''
  roles: string[] = ['ADMIN', 'alumno']
  selectedRole: string = ''
}
