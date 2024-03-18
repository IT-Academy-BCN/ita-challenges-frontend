import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-post-register-modal',
  templateUrl: './post-register-modal.component.html',
  styleUrl: './post-register-modal.component.scss'
})
export class PostRegisterModalComponent {

  constructor(private modalService: NgbModal){
  }

  closeModal() {
    this.modalService.dismissAll();
  }
}
