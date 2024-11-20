import { Component, inject, Input } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SolutionService } from 'src/app/services/solution.service'
import { UserService } from 'src/app/services/user.service'

@Component({
  selector: 'app-send-solution-modal',
  templateUrl: './send-solution-modal.component.html',
  styleUrls: ['./send-solution-modal.component.scss']
})

export class SendSolutionModalComponent {
  private readonly modalService = inject(NgbModal)
  private readonly solutionService = inject(SolutionService)
  private readonly userService = inject(UserService)

  @Input() idChallenge!: string

  public acceptSolution (): void {
    this.userService.addSolutionForChallenge(this.idChallenge)
    this.solutionService.updateSolutionSentState(true)
    this.solutionService.sendSolutionText(true)
    this.solutionService.activeIdSubject.next(2)
    this.closeModal()
  }

  public closeModal (): void {
    this.modalService.dismissAll()
  }
}
