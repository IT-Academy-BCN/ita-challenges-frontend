import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register-users-modal',
  templateUrl: './register-users-modal.component.html',
})
export class RegisterUsersModalComponent {
  private readonly modalService = inject(NgbModal)
  username: string = '';
  usernames: string[] = [];

  public closeModal (): void {
    this.modalService.dismissAll()
  }

  addUsername() {
    const trimmed = this.username.trim();
    if (trimmed && !this.usernames.includes(trimmed)) {
      this.usernames.push(trimmed);
      this.username = '';
    }
  }

  isDuplicateUsername(username: string): boolean {
    const trimmed = username.trim().toLowerCase();
    return trimmed.length > 0 && this.usernames.includes(trimmed);
  }
}
