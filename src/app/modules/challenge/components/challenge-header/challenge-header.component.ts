import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterModalComponent } from './../../../modals/register-modal/register-modal.component';

@Component({
  selector: 'app-challenge-header',
  templateUrl: './challenge-header.component.html',
  styleUrls: ['./challenge-header.component.scss']
})
export class ChallengeHeaderComponent {

  constructor(private modalService: NgbModal) {}

  openRegisterModal(){
    this.modalService.open(RegisterModalComponent, { centered : true, size : 'lg' })
  }
}
