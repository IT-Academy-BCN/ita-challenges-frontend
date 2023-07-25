import { ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { SendSolutionModalComponent } from './send-solution-modal.component';
import { By } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('SendSolutionModalComponent', () => {
  let component: SendSolutionModalComponent;
  let fixture: ComponentFixture<SendSolutionModalComponent>;
  let modalService: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendSolutionModalComponent]
    });
    fixture = TestBed.createComponent(SendSolutionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    modalService = TestBed.inject(NgbModal);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal', () => {
    spyOn(modalService, 'dismissAll').and.callThrough();
    fixture.debugElement.query(By.css('[data-testid="closeModal"]')).triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(modalService.dismissAll).toHaveBeenCalled();
  });
});
