import 'jest-preset-angular/setup-jest';
import { TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';

const mockToastrService = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
};

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      { provide: ToastrService, useValue: mockToastrService },
    ],
  });
});