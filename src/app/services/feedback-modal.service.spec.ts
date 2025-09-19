import { TestBed } from '@angular/core/testing';
import { FeedbackModalService } from './feedback-modal.service';
import Swal, { SweetAlertOptions } from 'sweetalert2';

// sweetalert2 library mock
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  showLoading: jest.fn(),
  close: jest.fn(),
}));

describe('FeedbackModalService', () => {
  let service: FeedbackModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackModalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


// Test for loadingChallengesModal()
  it('should display a loading modal with correct options', () => {
    const title = 'Loading challenges';
    service.loadingChallengesModal(title);
    
    
    expect(Swal.fire).toHaveBeenCalled();
    
    
    const options: SweetAlertOptions = (Swal.fire as jest.Mock).mock.calls[0][0];

    expect(options.title).toBe('Loading challenge'); // Correcting based on the provided code
    expect(options.allowOutsideClick).toBe(false);
    expect(options.showConfirmButton).toBe(false);

    
    if (options.didOpen) {
     
      options.didOpen({} as HTMLElement);
      expect(Swal.showLoading).toHaveBeenCalled();
    }

      });

  // Test for challengeCompletedModal()
  it('should display a challenge completed modal with correct options', () => {
    const text = 'You have successfully completed a challenge!';
    service.challengeCompletedModal('Challenge completed', text);

    expect(Swal.fire).toHaveBeenCalled();

    const options: SweetAlertOptions = (Swal.fire as jest.Mock).mock.calls[0][0];

    expect(options.icon).toBe('success');
    expect(options.title).toBe('Challenge completed');
    expect(options.text).toBe(text);
    expect(options.confirmButtonText).toBe('OK');
  });

  // Test for challengeSavedModal()
  it('should display a challenge saved modal with correct options', () => {
    const text = 'You have saved this challenge.';
    service.challengeSavedModal(text);
    
    expect(Swal.fire).toHaveBeenCalled();

    const options: SweetAlertOptions = (Swal.fire as jest.Mock).mock.calls[0][0];

    expect(options.icon).toBe('success');
    expect(options.title).toBe('Challenge saved');
    expect(options.text).toBe(text);
    expect(options.confirmButtonText).toBe('OK');
  });

  // Test for hideModal()
  it('should hide the current modal', () => {
    service.hideModal();
    expect(Swal.close).toHaveBeenCalled();
  });

});
