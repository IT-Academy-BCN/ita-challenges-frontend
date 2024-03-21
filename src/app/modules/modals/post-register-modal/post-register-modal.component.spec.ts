import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { PostRegisterModalComponent } from './post-register-modal.component'
import { Component } from '@angular/core'
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule } from '@ngx-translate/core'

describe('PostRegisterModalComponent', () => {
  let component: PostRegisterModalComponent
  let fixture: ComponentFixture<PostRegisterModalComponent>
  let modalServiceMock: any

  beforeEach(async () => {
    modalServiceMock = {
      dismissAll: jest.fn()
    }

    await TestBed.configureTestingModule({
      declarations: [PostRegisterModalComponent],
      imports: [NgbModule, TranslateModule.forRoot()],
      providers: [
        { provide: NgbModal, useValue: modalServiceMock }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(PostRegisterModalComponent)
    component = fixture.componentInstance
  })

  it('should create register component', () => {
    expect(component).toBeTruthy()
  })

  it('should close modal', () => {
    component.closeModal()
    expect(modalServiceMock.dismissAll).toBeCalled()
  })
})
