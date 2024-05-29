import { Component, inject } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SolutionService } from 'src/app/services/solution.service'

@Component({
  selector: 'app-send-solution-modal',
  templateUrl: './send-solution-modal.component.html',
  styleUrls: ['./send-solution-modal.component.scss']
})

export class SendSolutionModalComponent{
  
idChallenge: string = ''
idLanguage: string = ''
  
  // solutionSent = false;
  private readonly modalService = inject(NgbModal)
  private readonly solutionService = inject(SolutionService)

  public acceptSolution (): void {
    this.solutionService.updateSolutionSentState(true)
    this.closeModal()
    this.solutionService.activeIdSubject.next(2)
    console.log('send-solution modal. idChallenge:', this.idChallenge)
    console.log('send-solution modal. idLanguage:', this.idLanguage)
    
  }

  public closeModal (): void {
    this.modalService.dismissAll()
  }
}
