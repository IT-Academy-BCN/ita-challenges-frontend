import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss'
})
export class ToggleComponent {
  @Input() currentRole: string = ''
  roles: string[] = ['ADMIN', 'USER']
  selectedRole: string = ''

  @Output() roleSwiched = new EventEmitter<'ADMIN' | 'USER'>()

  switchUserRole (newRole: 'ADMIN' | 'USER'): void {
    this.roleSwiched.emit(newRole)
  }
}
