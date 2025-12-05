import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ChallengeService } from 'src/app/services/challenge.service';
import { StarterService } from 'src/app/services/starter.service';

@Component({
  selector: 'app-delete-challenge-modal',
  templateUrl: './delete-challenge-modal.component.html',
  styleUrls: ['./delete-challenge-modal.component.scss']
})
export class DeleteChallengeModalComponent {
  @Input() idChallenge!: string;

  private readonly challenges = inject(ChallengeService);
  private readonly router = inject(Router);
  private readonly i18n = inject(TranslateService);
  private readonly toast = inject(ToastrService);
  private readonly activeModal = inject(NgbActiveModal);

  private readonly starter = inject(StarterService);

  deleteChallenge(): void {
    if (!this.idChallenge) { return; }

    this.challenges.deleteChallenge(this.idChallenge).subscribe({
      next: () => {
        this.starter.invalidateCacheAndRefresh();
        this.toast.success(this.i18n.instant('modules.challenge.header.deletedSuccess') || 'Challenge deleted successfully');
        this.activeModal.close('deleted');
      },
      error: (err) => {
        console.error('Error deleting challenge:', err);
        this.toast.error(this.i18n.instant('modules.challenge.header.errorOnDelete') || 'Error deleting challenge');
      }
    });
  }

  closeModal(): void {
    this.activeModal.dismiss('cancel');
  }
}
