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
  errorUsername: string | null = null;
  private registeredSuccessfully: string[] = [];

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
    this.errorUsername = null;
    this.registeredSuccessfully = [];

    const usernamesQueue = [...this.usernames];

    const processNext = () => {
      if (usernamesQueue.length === 0) {
        this.registrationSuccess = true;
        this.usernames = [];
        return;
      }

      const username = usernamesQueue[0];
      this.registerUsersService.registerUser(username).subscribe({
        next: () => {
          this.registeredSuccessfully.push(username);
          usernamesQueue.shift();
          processNext();
        },
        error: () => {
          this.registrationSuccess = false;
          this.errorUsername = username;

          this.usernames = this.usernames.filter(u => !this.registeredSuccessfully.includes(u));
        }
      });
    };

    processNext();
  }
}
