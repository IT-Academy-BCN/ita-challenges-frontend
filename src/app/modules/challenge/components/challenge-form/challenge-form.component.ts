// import { Component, inject, type OnInit } from '@angular/core'
import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { ChallengeService } from 'src/app/services/challenge.service'
import { type CreateChallenge } from '../../../../models/create-challenge.interface'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { EditorModule } from '@tinymce/tinymce-angular'

@Component({
  standalone: true,
  selector: 'app-challenge-form',
  templateUrl: './challenge-form.component.html',
  styleUrls: ['./challenge-form.component.scss'],
  imports: [FormsModule, CommonModule, EditorModule]
})

export class ChallengeFormComponent {
  challenge: CreateChallenge = {
    challengeTitle: '',
    description: '',
    level: 'EASY',
    language: 'Java' as 'Java' | 'PHP' | 'Python' | 'Javascript' | 'Typescript' | 'SQL',
    solution: ''
  }

  editorConfig = {
    base_url: '/assets/tinymce',
    suffix: '.min',
    height: 300,
    menubar: false,
    branding: false,
    elementpath: false,
    statusbar: true,
    license_key: 'gpl',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'charmap',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons'
    ],
    toolbar: 'undo redo | formatselect | ' +
      'h2 h3 | bold italic underline | forecolor backcolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | emoticons | help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
  }

  private readonly challengeService = inject(ChallengeService)
  private readonly router = inject(Router)

  ngOnInit (): void {
    // No necesitas inicializar nada extra para ngx-quill
  }

  public isFormValid (): boolean {
    return (
      this.challenge.challengeTitle.trim() !== '' &&
      this.challenge.description.trim() !== '' &&
      ['Java', 'PHP', 'Python', 'Javascript', 'Typescript', 'SQL'].includes(this.challenge.language) &&
      this.challenge.solution.trim() !== ''
    )
  }

  onSubmit (): void {
    if (!this.isFormValid()) {
      console.error('El formulario no es válido')
      return
    }

    console.log('Contenido enriquecido:', this.challenge.description)

    this.challengeService.createChallenge(this.challenge).subscribe({
      next: (response) => {
        console.log('Reto creado:', response)
        // Temporary: Redirects to /challenges for now.
        // Future:
        // - Only mentors will access this feature.
        // - Redirect to mentor dashboard after creation.
        // - Add a guard to restrict access to mentors.
        void this.router.navigate(['/ita-challenge/challenges'])
      },
      error: (err) => {
        console.error('Error al crear el reto:', err)
      }
    })
  }
}
