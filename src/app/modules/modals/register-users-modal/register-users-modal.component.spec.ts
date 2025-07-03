import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterUsersModalComponent } from './register-users-modal.component';

describe('RegisterUsersModalComponent', () => {
  let component: RegisterUsersModalComponent;
  let fixture: ComponentFixture<RegisterUsersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterUsersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});