import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RegisterUsersService } from 'src/app/services/register-users.service';

@Component({
  selector: 'app-register-users-modal',
  templateUrl: './register-users-modal.component.html',
})
export class RegisterUsersModalComponent {
  private readonly modalService = inject(NgbModal)
  private readonly registerUsersService = inject(RegisterUsersService);
  username: string = '';
  usernames: string[] = [];
  registrationSuccess: boolean | null = null;
  pendingResponses = 0;

  public closeModal(): void {
    this.modalService.dismissAll()
  }

  private normalizeUsername(username: string): string {
    return username.trim().toLowerCase();
  }

  addUsername() {
    const normalized = this.normalizeUsername(this.username);
    if (normalized && !this.isDuplicateUsername(normalized)) {
      this.usernames.push(this.username.trim());
      this.username = '';
    }
  }

  isDuplicateUsername(username: string): boolean {
    const normalized = this.normalizeUsername(username);
    return this.usernames.some(u => this.normalizeUsername(u) === normalized);
  }

  confirmRegistration(): void {
    this.registrationSuccess = null;
    const registrationObservables = this.usernames.map(username =>
      this.registerUsersService.registerUserMockSuccess(username).pipe(
        map(response => ({ success: true, username, response })),
        catchError(error => of({ success: false, username, error }))
      )
    );

    forkJoin(registrationObservables).subscribe(results => {
      this.registrationSuccess = results.every(result => result.success);
      if (this.registrationSuccess) {
        this.usernames = [];
      }
    })
  }
}
