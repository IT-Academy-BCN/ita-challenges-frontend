import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from './../../../services/auth.service';

import { RegisterModalComponent } from './register-modal.component';

describe('RegisterModalComponent', () => {
  let component: RegisterModalComponent;
  let fixture: ComponentFixture<RegisterModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterModalComponent]
    });
    fixture = TestBed.createComponent(RegisterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
