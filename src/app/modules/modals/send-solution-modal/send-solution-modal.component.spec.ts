import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SendSolutionModalComponent } from './send-solution-modal.component';
import { HttpClientModule } from '@angular/common/http'; 

describe('SendSolutionModalComponent', () => {
  let component: SendSolutionModalComponent;
  let fixture: ComponentFixture<SendSolutionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendSolutionModalComponent],
      imports: [HttpClientModule], 
    });
    fixture = TestBed.createComponent(SendSolutionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
