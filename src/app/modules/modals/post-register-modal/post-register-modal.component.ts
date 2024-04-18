import { Component, inject } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-post-register-modal',
  templateUrl: './post-register-modal.component.html',
  styleUrl: './post-register-modal.component.scss'
})
export class PostRegisterModalComponent {
  private readonly modalService = inject(NgbModal)

  closeModal (): void {
    this.modalService.dismissAll()
  }
}
