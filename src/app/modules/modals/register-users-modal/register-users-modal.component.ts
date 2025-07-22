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
    this.pendingResponses = this.usernames.length;

    this.usernames.forEach(username => {
      this.registerUsersService.registerUserMockSuccess(username).subscribe({
        next: (res) => this.checkIfRegistrationCompleted(false),
        error: (err) => this.checkIfRegistrationCompleted(true)
      });
    })
  }

  checkIfRegistrationCompleted(errorOccurred: boolean): void {
    if (errorOccurred) this.registrationSuccess = false;
    
    this.pendingResponses--;

    if (this.pendingResponses === 0 && this.registrationSuccess !== false) {
      this.registrationSuccess = true;
      this.usernames = [];
    }
  }
}
