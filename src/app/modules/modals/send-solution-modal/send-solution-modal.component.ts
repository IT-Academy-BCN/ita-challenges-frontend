import { Component } from '@angular/core'
import { type NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { type SolutionService } from 'src/app/services/solution.service'

@Component({
  selector: 'app-send-solution-modal',
  templateUrl: './send-solution-modal.component.html',
  styleUrls: ['./send-solution-modal.component.scss']
})

export class SendSolutionModalComponent {
  // solutionSent = false;
  constructor (private readonly modalService: NgbModal, private readonly solutionService: SolutionService) {}

  acceptSolution () {
    this.solutionService.updateSolutionSentState(true)
    this.closeModal()
  }

  closeModal () {
    this.modalService.dismissAll()
  }
}
