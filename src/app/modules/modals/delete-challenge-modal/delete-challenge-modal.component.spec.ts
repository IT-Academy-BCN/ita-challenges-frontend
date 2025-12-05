// src/app/modules/modals/delete-challenge-modal/delete-challenge-modal.component.spec.ts
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { DeleteChallengeModalComponent } from './delete-challenge-modal.component';
import { ChallengeService } from 'src/app/services/challenge.service';
import { StarterService } from 'src/app/services/starter.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('DeleteChallengeModalComponent', () => {
  let component: DeleteChallengeModalComponent;
  let fixture: ComponentFixture<DeleteChallengeModalComponent>;

  const mockActiveModal = {
    close: jasmine.createSpy('close'),
    dismiss: jasmine.createSpy('dismiss')
  };

  const mockToastr = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error')
  };

  const mockChallengeService = {
    deleteChallenge: jasmine.createSpy('deleteChallenge').and.returnValue(of(void 0))
  };

  const mockStarter = {
    invalidateCacheAndRefresh: jasmine.createSpy('invalidateCacheAndRefresh')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteChallengeModalComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: NgbActiveModal, useValue: mockActiveModal }, // required by the component
        { provide: ToastrService, useValue: mockToastr },
        { provide: ChallengeService, useValue: mockChallengeService },
        { provide: StarterService, useValue: mockStarter },
        TranslateService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteChallengeModalComponent);
    component = fixture.componentInstance;
    component.idChallenge = '12345';
    fixture.detectChanges();
  });

  beforeEach(() => {
    mockActiveModal.close.calls.reset();
    mockActiveModal.dismiss.calls.reset();
    mockToastr.success.calls.reset();
    mockToastr.error.calls.reset();
    mockChallengeService.deleteChallenge.calls.reset();
    mockStarter.invalidateCacheAndRefresh.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal (dismiss) when closeModal is called', () => {
    component.closeModal();
    expect(mockActiveModal.dismiss).toHaveBeenCalledWith('cancel');
  });

  it('should delete, refresh and close with "deleted" on success', () => {
    mockChallengeService.deleteChallenge.and.returnValue(of(void 0));

    component.deleteChallenge();

    expect(mockChallengeService.deleteChallenge).toHaveBeenCalledWith('12345');
    expect(mockStarter.invalidateCacheAndRefresh).toHaveBeenCalled();
    expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
    expect(mockToastr.success).toHaveBeenCalled();
  });

  it('should show error on delete error (no close expected)', () => {
    mockChallengeService.deleteChallenge.and.returnValue(throwError(() => new Error('boom')));

    component.deleteChallenge();

    expect(mockToastr.error).toHaveBeenCalled();
    expect(mockActiveModal.close).not.toHaveBeenCalled();
  });
});
