import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-register-users-modal',
  templateUrl: './register-users-modal.component.html',
  styleUrl: './register-users-modal.component.css'
})
export class RegisterUsersModalComponent {
  private readonly modalService = inject(NgbModal)


  public closeModal (): void {
    this.modalService.dismissAll()
  }
}
