import { Component, inject } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SolutionService } from 'src/app/services/solution.service'

@Component({
  selector: 'app-send-solution-modal',
  templateUrl: './send-solution-modal.component.html',
  styleUrls: ['./send-solution-modal.component.scss']
})

export class SendSolutionModalComponent {
  private readonly modalService = inject(NgbModal)
  private readonly solutionService = inject(SolutionService)

  public acceptSolution (): void {
    console.log('acceptSolution chiamato - cambio a tab Solution')
    this.solutionService.updateSolutionSentState(true)
    this.solutionService.sendSolutionText(true)
    this.solutionService.activeIdSubject.next(2)
    this.closeModal()
  }

  public closeModal (): void {
    this.modalService.dismissAll()
  }
}
