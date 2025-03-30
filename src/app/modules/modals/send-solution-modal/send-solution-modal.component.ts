import { Component, inject, Input } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SolutionService } from 'src/app/services/solution.service'
import { ChallengeService } from '../../../services/challenge.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-send-solution-modal',
  templateUrl: './send-solution-modal.component.html',
  styleUrls: ['./send-solution-modal.component.scss']
})

export class SendSolutionModalComponent {
  private readonly modalService = inject(NgbModal)
  private readonly solutionService = inject(SolutionService)
  private readonly challengeService = inject(ChallengeService);

  @Input() idChallenge!: string
  @Input() userId!: string;
  languageId: string = ''; 
  solutionText: string = '';

  ngOnInit(): void {
    this.getLanguageId(); 
    this.getSolutionText(); 
  }

  public getLanguageId(): void {
    this.challengeService.getChallengeById(this.idChallenge).subscribe({
      next: (challenge) => {
        this.languageId = challenge.languages[0].id_language;
      },
      error: (error) => {
        console.error("Error al obtener Language ID:", error);
      }
    });
  }

  public getSolutionText(): void {
    this.solutionText = localStorage.getItem('editorContent') || '';
  }

  public acceptSolution(): void {

    this.solutionService.submitSolution(
      this.idChallenge,
      this.languageId,
      this.solutionText,
      this.userId,
      "ENDED"
    ).subscribe({
      next: (response) => {
        this.solutionService.updateSolutionSentState(true);
        this.solutionService.sendSolutionText(true);
        this.solutionService.activeIdSubject.next(2);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al enviar la solución:', error);
      }
    });
  }

  public closeModal (): void {
    this.modalService.dismissAll()
  }
}
