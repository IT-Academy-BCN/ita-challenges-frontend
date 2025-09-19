import { TestBed } from '@angular/core/testing';
import { FeedbackModalService } from './feedback-modal.service';



describe('FeedbackModalService', () => {
  let service: FeedbackModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackModalService);
  });

  

  it('should be created', () => {
    expect(service).toBeTruthy();
  });



});
