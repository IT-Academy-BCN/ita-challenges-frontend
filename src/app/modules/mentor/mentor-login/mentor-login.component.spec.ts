import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { MentorLoginComponent } from './mentor-login.component'
import { provideHttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { ReactiveFormsModule } from '@angular/forms'

describe('MentorLoginComponent', () => {
  let component: MentorLoginComponent
  let fixture: ComponentFixture<MentorLoginComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule
      ],
      providers: [
        provideHttpClient(),
        provideRouter([])
      ],
      declarations: [MentorLoginComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorLoginComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should have a disabled login button if terms are not accepted', () => {
    const button = fixture.nativeElement.querySelector('.github-button')
    expect(button.disabled).toBeTruthy()
  })

  it('should enable login button when terms are accepted', () => {
    component.loginForm.controls.termsCheck.setValue(true)
    fixture.detectChanges()

    const button = fixture.nativeElement.querySelector('.github-button')
    expect(button.disabled).toBeFalsy()
  })

  it('should set isLoading to true when clicking login', () => {
    component.loginForm.controls.termsCheck.setValue(true)
    component.loginWithGitHub()

    expect(component.isLoading).toBeTruthy()
  })

  it('should show error if login is attempted without accepting terms', () => {
    component.loginWithGitHub()
    expect(component.showTermsError).toBeTruthy()
  })
})
