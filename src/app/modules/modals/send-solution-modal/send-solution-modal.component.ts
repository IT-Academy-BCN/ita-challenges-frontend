import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolutionService } from 'src/app/services/solution.service';

@Component({
  selector: 'app-send-solution-modal',
  templateUrl: './send-solution-modal.component.html',
  styleUrls: ['./send-solution-modal.component.scss']
})

export class SendSolutionModalComponent {
  // solutionSent = false;
  constructor(private modalService: NgbModal, private solutionService: SolutionService) {}

  acceptSolution() {
    this.solutionService.updateSolutionSentState(true);
    this.closeModal();
  }

  closeModal() {
    this.modalService.dismissAll();
  }
}
