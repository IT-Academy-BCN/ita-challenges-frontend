import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolutionAction } from 'src/app/models/user-solution-action.enum';
import { UserSolution } from 'src/app/models/user-solution.interface';
import { ChallengeService } from 'src/app/services/challenge.service';
import { SolutionService } from 'src/app/services/solution.service';
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum';

@Component({
  selector: 'app-show-solution-modal',
  templateUrl: './show-solution-modal.component.html',
 styleUrls: ['./show-solution-modal.component.css']
})
export class ShowSolutionModalComponent {
  private readonly modalService = inject(NgbModal)
  private readonly solutionService = inject(SolutionService);
  private readonly challengeService = inject(ChallengeService);

  @Input() idChallenge!: string
  @Input() userId!: string;
  languageId: string = ''; 
  @Input() solutionText: string = '';
  @Output() mentorSolutionProvided = new EventEmitter<boolean>();
  @Output() solutionSubmitted = new EventEmitter<string>();
  
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


   public mentorSolutionShowed(): void {
      if (this.userId === null) {
        console.error("User ID is missing. Cannot show solution.");
        return;
      }
      this.solutionService.submitSolution(
        this.idChallenge,
        this.languageId,
        this.userId,
        SolutionAction.SEE_SOLUTION,
        this.solutionText
      ).subscribe({
        next: (response: UserSolution) => {
          const solutionText = response?.solution_text ?? '';        
          this.solutionService.solutionText(solutionText);
          this.solutionService.updateSolutionSentState(true);
          this.solutionService.activeIdSubject.next(ChallengeTab.SOLUTIONS);
          this.solutionService.completeChallenge(this.idChallenge);
          this.mentorSolutionProvided.emit(true);
          this.closeModal()
        },
        error: (error) => {
          console.error('Error showing solution:', error);
        }
      });
    }

  public closeModal (): void {
    this.modalService.dismissAll()
  }

}
