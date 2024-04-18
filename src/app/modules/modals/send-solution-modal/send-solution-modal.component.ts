import { Component, inject } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SolutionService } from 'src/app/services/solution.service'

@Component({
  selector: 'app-send-solution-modal',
  templateUrl: './send-solution-modal.component.html',
  styleUrls: ['./send-solution-modal.component.scss']
})

export class SendSolutionModalComponent {
  // solutionSent = false;
  private readonly modalService = inject(NgbModal)
  private readonly solutionService = inject(SolutionService)

  acceptSolution (): void {
    this.solutionService.updateSolutionSentState(true)
    this.closeModal()
  }

  closeModal (): void {
    this.modalService.dismissAll()
  }
}
