import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ChallengeService } from 'src/app/services/challenge.service';


@Component({
  selector: 'app-delete-challenge-modal',
  templateUrl: './delete-challenge-modal.component.html',
  styleUrl: './delete-challenge-modal.component.css'
})
export class DeleteChallengeModalComponent {
  @Input() idChallenge!: string;
  private readonly challengeService = inject(ChallengeService)
  private readonly router = inject(Router)
  private readonly translate = inject(TranslateService)
  private readonly toastr = inject(ToastrService)

private readonly modalService = inject(NgbModal)

    deleteChallenge(): void {
    this.challengeService.deleteChallenge(this.idChallenge).subscribe({
      next: () => {
        this.toastr.success(this.translate.instant('modules.challenge.header.deletedSuccess') || 'Challenge deleted successfully');
        this.router.navigate(['/ita-challenge/challenges']);
      },
      error: (err) => {
        console.error('Error deleting challenge:', err);
        this.toastr.error(this.translate.instant('modules.challenge.header.errorOnDelete') || 'An error occurred while deleting the challenge. Please try again later');
      }
    });
    this.closeModal();
  }

   public closeModal (): void {
    this.modalService.dismissAll()
  }
}



