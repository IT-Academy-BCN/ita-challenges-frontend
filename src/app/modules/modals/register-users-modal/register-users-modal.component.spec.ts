import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterUsersModalComponent } from './register-users-modal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import { RegisterUsersService } from '../../../services/register-users.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateService } from '@ngx-translate/core';

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform(value: string) { return value; }
}

describe('RegisterUsersModalComponent', () => {
  let component: RegisterUsersModalComponent;
  let fixture: ComponentFixture<RegisterUsersModalComponent>;
  let mockModalService: jest.Mocked<NgbModal>;
  let registerUsersService: RegisterUsersService;

  beforeEach(async () => {
    mockModalService = {
      dismissAll: jest.fn(),
    } as unknown as jest.Mocked<NgbModal>;

    await TestBed.configureTestingModule({
      declarations: [RegisterUsersModalComponent, MockTranslatePipe],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [
        { provide: NgbModal, useValue: mockModalService },
        {
          provide: TranslateService,
          useValue: {
            instant: jest.fn().mockReturnValue(''),
          },
        },
        RegisterUsersService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUsersModalComponent);
    component = fixture.componentInstance;
    registerUsersService = TestBed.inject(RegisterUsersService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should add a trimmed username to the list', () => {
    component.username = '  user123  ';
    component.addUsername();
    expect(component.usernames).toContain('user123');
    expect(component.username).toBe('');
  });

  it('should not add empty usernames', () => {
    component.username = '   ';
    component.addUsername();
    expect(component.usernames).toHaveLength(0);
  });

  it('should not add duplicate usernames', () => {
    component.usernames = ['user123'];
    component.username = 'user123';
    component.addUsername();
    expect(component.usernames).toHaveLength(1);
  });

  it('should call dismissAll when closing the modal', () => {
    component.closeModal();
    expect(mockModalService.dismissAll).toHaveBeenCalled();
  });

  it('should be case-insensitive when checking for duplicate usernames', () => {
    component.usernames = ['user123'];
    component.username = 'User123';
    component.addUsername();
    expect(component.usernames).toHaveLength(1);
  });

  it('should initialize with default values', () => {
    expect(component.username).toBe('');
    expect(component.usernames).toEqual([]);
  });

  it('should detect duplicate usernames with different whitespace', () => {
    component.usernames = ['user123'];
    expect(component.isDuplicateUsername('  user123  ')).toBe(true);
  });

  it('should normalize a username by trimming and converting to lowercase', () => {
    const normalized = component['normalizeUsername']('  UserNAME  ');
    expect(normalized).toBe('username');
  });

  it('should register users and set success flag', () => {
    component.usernames = ['user1', 'user2'];
    jest.spyOn(registerUsersService, 'registerUserMock').mockReturnValue(of({}));

    component.confirmRegistration();

    expect(registerUsersService.registerUserMock).toHaveBeenCalledTimes(2);
    expect(component.registrationSuccess).toBe(true);
    expect(component.registrationError).toBe(false);
  });
});
