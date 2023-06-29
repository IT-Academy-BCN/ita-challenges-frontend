import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendSolutionModalComponent } from '../../../modules/modals/send-solution-modal/send-solution-modal.component';

@Component({
  selector: 'app-solutions-logged-button',
  templateUrl: './solutions-logged-button.component.html',
  styleUrls: ['./solutions-logged-button.component.scss']
})
export class SolutionsLoggedButtonComponent {
  constructor(private modalService: NgbModal) {}

  
  openSendSolutionModal(){
    this.modalService.open(SendSolutionModalComponent, { centered : true, size : 'lg' })
  }
}
