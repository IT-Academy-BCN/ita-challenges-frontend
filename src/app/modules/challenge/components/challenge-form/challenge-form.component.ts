/* import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { ChallengeService } from 'src/app/services/challenge.service'
import { type CreateChallenge } from '../../../../models/create-challenge.interface'

@Component({
  standalone: true,
  selector: 'app-challenge-form',
  templateUrl: './challenge-form.component.html',
  styleUrls: ['./challenge-form.component.scss']
})
export class ChallengeFormComponent {
  challenge: CreateChallenge = {
    challengeTitle: '',
    description: '',
    level: 'EASY',
    language: 'Java' as 'Java' | 'PHP' | 'Python' | 'JavaScript',
    solution: ''
  }

  private readonly challengeService = inject(ChallengeService)
  private readonly router = inject(Router)

  private isFormValid (): boolean {
    return (
      this.challenge.challengeTitle.trim() !== '' &&
        this.challenge.description.trim() !== '' &&
        ['Java', 'PHP', 'Python', 'JavaScript'].includes(this.challenge.language) &&
        this.challenge.solution.trim() !== ''
    )
  }

  onSubmit (): void {
    this.challengeService.createChallenge(this.challenge).subscribe({
      next: (response) => {
        console.log('Reto creado:', response)
        // Redirigir al listado o mostrar mensaje de éxito
        void this.router.navigate(['/ita-challenge/challenges'])
      },
      error: (err) => {
        console.error('Error al crear el reto:', err)
      }
    })
  }
} */

import { Component, inject } from '@angular/core'
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
  imports: [FormsModule, CommonModule] // Importa FormsModule y CommonModule
})
export class ChallengeFormComponent {
  challenge: CreateChallenge = {
    challengeTitle: '',
    description: '',
    level: 'EASY',
    language: 'Java' as 'Java' | 'PHP' | 'Python' | 'JavaScript',
    solution: ''
  }

  private readonly challengeService = inject(ChallengeService)
  private readonly router = inject(Router)

  private isFormValid (): boolean {
    return (
      this.challenge.challengeTitle.trim() !== '' &&
      this.challenge.description.trim() !== '' &&
      ['Java', 'PHP', 'Python', 'JavaScript'].includes(this.challenge.language) &&
      this.challenge.solution.trim() !== ''
    )
  }

  onSubmit (): void {
    if (!this.isFormValid()) {
      console.error('El formulario no es válido')
    }

    this.challengeService.createChallenge(this.challenge).subscribe({
      next: (response) => {
        console.log('Reto creado:', response)
        void this.router.navigate(['/ita-challenge/challenges'])
      },
      error: (err) => {
        console.error('Error al crear el reto:', err)
      }
    })
  }
}
