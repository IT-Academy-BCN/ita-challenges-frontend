import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SolutionService } from 'src/app/services/solution.service'
import { ChallengeService } from '../../../services/challenge.service';
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum';
import { SubmitSolutionResponse } from 'src/app/models/user-solution.interface';
import { SolutionAction } from 'src/app/models/user-solution-action.enum'


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
  @Input() solutionText: string = '';
  @Output() solutionAccepted = new EventEmitter<boolean>();
  @Output() solutionSubmitted = new EventEmitter<string>();
  @Output() timesSolvedUpdated = new EventEmitter<number>();

  ngOnInit(): void {
    this.getLanguageId(); 
    
  }

  public getLanguageId(): void {
    this.challengeService.getChallengeById(this.idChallenge).subscribe({
      next: (challenge) => {
        this.languageId = challenge.languages[0].id_language;
      },
      error: (error) => {
        console.error("Error obtaining Language ID:", error);
      }
    });
  }

  public acceptSolution(): void {
    this.solutionService.submitSolution(
      this.idChallenge,
      this.languageId,
      this.userId,
      SolutionAction.COMPLETED,
      this.solutionText
    ).subscribe({
      next: (response: SubmitSolutionResponse) => {
        this.timesSolvedUpdated.emit(response.timesSolved);
        const solutionText = response.solution_text;
        this.solutionService.solutionText(solutionText);
        this.solutionSubmitted.emit(solutionText); 
        this.solutionService.updateSolutionSentState(true);
        this.solutionService.sendSolutionText(true);
        this.solutionService.activeIdSubject.next(ChallengeTab.SOLUTIONS);
        
        this.solutionService.completeChallenge(this.idChallenge);
        
        this.solutionAccepted.emit();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error submitting solution:', error);
      }
    });
  }

  public closeModal (): void {
    this.modalService.dismissAll()
  }
}
