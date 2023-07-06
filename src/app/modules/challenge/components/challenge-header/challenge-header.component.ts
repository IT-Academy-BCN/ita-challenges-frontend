import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestrictedModalComponent } from './../../../modals/restricted-modal/restricted-modal.component';

@Component({
  selector: 'app-challenge-header',
  templateUrl: './challenge-header.component.html',
  styleUrls: ['./challenge-header.component.scss']
})
export class ChallengeHeaderComponent {

  constructor(private modalService: NgbModal) {}

  openRestrictedModal(){
    this.modalService.open(RestrictedModalComponent, { centered : true, size : 'lg' })
  }
}
