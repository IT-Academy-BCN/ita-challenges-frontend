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

  // Test for loadingPostingChallengesModal()
  it('should display a loading modal with a custom title and show a spinner', () => {
    const title = 'Posting a new challenge...';
    service.loadingPostingChallengesModal(title);

    expect(Swal.fire).toHaveBeenCalledTimes(1);

    const options: SweetAlertOptions = (Swal.fire as jest.Mock).mock.calls[0][0];

    expect(options.title).toBe('Posting challenge');
    expect(options.allowOutsideClick).toBe(false);
    expect(options.showConfirmButton).toBe(false);

    if (options.didOpen) {
      options.didOpen({} as HTMLElement);
      expect(Swal.showLoading).toHaveBeenCalled();
    }
  });

  // Test for successPostingChallengeModal()
  it('should display a success modal for a posted challenge', async () => {
    const title = 'Challenge posted';
    const text = 'Thank you for your contribution!';
    await service.successPostingChallengeModal(title, text);

    expect(Swal.fire).toHaveBeenCalledTimes(1);

    const options: SweetAlertOptions = (Swal.fire as jest.Mock).mock.calls[0][0];

    expect(options.icon).toBe('success');
    expect(options.title).toBe(title);
    expect(options.text).toBe(text);
    expect(options.confirmButtonText).toBe('Go to challenges');
  });

  // Test for errorPostingChallengeModal()
  it('should display an error modal for a failed challenge post', async () => {
    const text = 'Error message from backend.';
    await service.errorPostingChallengeModal(text);

    expect(Swal.fire).toHaveBeenCalledTimes(1);

    const options: SweetAlertOptions = (Swal.fire as jest.Mock).mock.calls[0][0];

    expect(options.icon).toBe('error');
    expect(options.title).toBe('Erros when posting challenge');
    expect(options.text).toBe(text);
    expect(options.confirmButtonText).toBe('Back');
  });

  // Test for hideModal()
  it('should hide the current modal', () => {
    service.hideModal();
    expect(Swal.close).toHaveBeenCalledTimes(1);
  });
});