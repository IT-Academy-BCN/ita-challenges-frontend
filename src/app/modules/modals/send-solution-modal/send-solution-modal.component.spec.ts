import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { SendSolutionModalComponent } from './send-solution-modal.component'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule } from '@ngx-translate/core'
import { Router } from '@angular/router'

describe('SendSolutionModalComponent', () => {
  let component: SendSolutionModalComponent
  let fixture: ComponentFixture<SendSolutionModalComponent>
  let modalServiceMock: any
  let routerMock: any

  beforeEach(async () => {
    // Crear versiones simuladas de NgbModal y Router
    modalServiceMock = {
      dismissAll: jest.fn(),
      open: jest.fn()
    }

    routerMock = {
      navigateByUrl: jest.fn()
    }

    await TestBed.configureTestingModule({
      declarations: [SendSolutionModalComponent],
      imports: [NgbModule, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: NgbModal, useValue: modalServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(SendSolutionModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
