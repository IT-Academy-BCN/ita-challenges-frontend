import { Component } from '@angular/core'
import { type NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-post-register-modal',
  templateUrl: './post-register-modal.component.html',
  styleUrl: './post-register-modal.component.scss'
})
export class PostRegisterModalComponent {
  constructor (private readonly modalService: NgbModal) {
  }

  closeModal (): void {
    this.modalService.dismissAll()
  }
}
