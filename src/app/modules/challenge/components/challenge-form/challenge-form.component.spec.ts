import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ChallengeFormComponent } from './challenge-form.component'
import { ChallengeService } from 'src/app/services/challenge.service'
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { EditorModule } from '@tinymce/tinymce-angular'
import { of } from 'rxjs'
import { type CreateChallenge } from '../../../../models/create-challenge.interface'

describe('ChallengeFormComponent', () => {
  let component: ChallengeFormComponent
  let fixture: ComponentFixture<ChallengeFormComponent>
  let mockChallengeService: jest.Mocked<ChallengeService>
  let mockRouter: jest.Mocked<Router>

  beforeEach(async () => {
    mockChallengeService = {
      createChallenge: jest.fn()
    } as unknown as jest.Mocked<ChallengeService>

    mockRouter = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, EditorModule, ChallengeFormComponent],
      providers: [
        { provide: ChallengeService, useValue: mockChallengeService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(ChallengeFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize TinyMCE configuration', () => {
    expect(component.editorConfig).toBeTruthy()
    expect(component.editorConfig.plugins).toContain('code')
    expect(component.editorConfig.toolbar).toContain('bold')
  })

  it('should validate form correctly', () => {
    component.challenge = {
      challengeTitle: 'Test Challenge',
      description: 'Test Description',
      level: 'EASY',
      language: 'Java',
      solution: 'Test Solution'
    }
    expect(component.isFormValid()).toBe(true)

    component.challenge.challengeTitle = ''
    expect(component.isFormValid()).toBe(false)
  })

  it('should not submit the form if invalid', () => {
    jest.spyOn(console, 'error')

    component.challenge = {
      challengeTitle: '',
      description: '',
      level: 'EASY',
      language: 'Java',
      solution: ''
    }

    component.onSubmit()
    expect(console.error).toHaveBeenCalledWith('El formulario no es válido')
    expect(mockChallengeService.createChallenge).not.toHaveBeenCalled()
  })

  it('should call ChallengeService on valid form submission', () => {
    const mockChallenge: CreateChallenge = {
      challengeTitle: 'Test Challenge',
      description: 'Test Description',
      level: 'EASY',
      language: 'Java',
      solution: 'Test Solution'
    }

    mockChallengeService.createChallenge.mockReturnValue(of({ success: true }))

    component.challenge = mockChallenge
    component.onSubmit()

    expect(mockChallengeService.createChallenge).toHaveBeenCalledWith(mockChallenge)
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/ita-challenge/challenges'])
  })
})
