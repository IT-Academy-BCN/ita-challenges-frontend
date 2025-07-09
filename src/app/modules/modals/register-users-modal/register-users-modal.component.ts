import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  registrationError = false;
  registrationSuccess = false;
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
    this.registrationError = false;
    this.registrationSuccess = false;
    this.pendingResponses = this.usernames.length;

    this.usernames.forEach(username => {
      this.registerUsersService.registerUserMockSuccess(username).subscribe({
        next: (res) => {
          console.log(`User ${username} registered successfully`, res);
          this.checkIfRegistrationCompleted();
        },
        error: (err) => {
          console.error(`Error registering user ${username}`, err);
          this.registrationError = true;
          this.checkIfRegistrationCompleted();
        }
      });
    })
  }

  checkIfRegistrationCompleted(): void {
    this.pendingResponses--;

    if (this.pendingResponses === 0) {
      if (!this.registrationError) {
        this.registrationSuccess = true;
        this.usernames = [];
      }    }
  }
}
