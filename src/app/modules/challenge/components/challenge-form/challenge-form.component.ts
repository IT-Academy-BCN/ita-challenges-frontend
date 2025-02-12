import { Component, inject, type OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ChallengeService } from 'src/app/services/challenge.service'
import { type CreateChallenge } from '../../../../models/create-challenge.interface'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

@Component({
  standalone: true,
  selector: 'app-challenge-form',
  templateUrl: './challenge-form.component.html',
  styleUrls: ['./challenge-form.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class ChallengeFormComponent implements OnInit {
  challenge: CreateChallenge = {
    challengeTitle: '',
    description: '', // Aquí guardaremos el contenido enriquecido como HTML
    level: 'EASY',
    language: 'Java' as 'Java' | 'PHP' | 'Python' | 'Javascript' | 'Typescript' | 'SQL',
    solution: ''
  }

  private readonly challengeService = inject(ChallengeService)
  private readonly router = inject(Router)

  ngOnInit (): void {
    // No necesitas inicializar nada extra para ngx-quill
  }

  private isFormValid (): boolean {
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
