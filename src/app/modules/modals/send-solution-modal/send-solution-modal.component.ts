import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolutionService } from '../../../services/solution.service';


@Component({
  selector: 'app-send-solution-modal',
  templateUrl: './send-solution-modal.component.html',
  styleUrls: ['./send-solution-modal.component.scss']
})
export class SendSolutionModalComponent {
  constructor(private modalService: NgbModal, private solutionService: SolutionService) {}

  acceptSolution() {
    this.solutionService.updateSolutionSentState(true);
    this.closeModal();
  }

  closeModal() {
    this.modalService.dismissAll();
  }
}
