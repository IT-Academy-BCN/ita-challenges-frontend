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

  public closeModal (): void {
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

 confirmRegistration():void {
  this.usernames.forEach(username =>{
    this.registerUsersService.registerUserMock(username).subscribe({
      next: (res) => {
        console.log(`User ${username} registered successfully`, res);
      },
      error: (err) => {
        console.error(`Error registering user ${username}`, err);
      }
    });
  })
  this.usernames = [];
  this.closeModal();
 }
}
