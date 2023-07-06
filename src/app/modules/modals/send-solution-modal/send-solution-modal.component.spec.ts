import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendSolutionModalComponent } from './send-solution-modal.component';

describe('SendSolutionModalComponent', () => {
  let component: SendSolutionModalComponent;
  let fixture: ComponentFixture<SendSolutionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendSolutionModalComponent]
    });
    fixture = TestBed.createComponent(SendSolutionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
