import { Component, Input } from '@angular/core'
// import type { Challenge } from 'src/app/models/challenges.interface'
// import { ChallengeService } from '../../../../services/challenge.service'
// import { ChallengeDetails } from 'src/app/models/challenge-details.model'

@Component({
  selector: 'app-star-challenge',
  templateUrl: './start-challenge.component.html',
  styleUrls: ['./start-challenge.component.scss']
})
export class StartChallengeComponent {
  showDetails: boolean = false
  challengeId: string = '' // ID del reto
  description: string = '' // Descripción del reto
  examples: any[] = [] // Ejemplos del reto
  showStatement: boolean = true // Mostrar enunciado
  showEditor: boolean = true // Mostrar editor

  // @Input() detail!: ChallengeDetails
  @Input() notes!: string

  // constructor (private readonly ChallengeService: ChallengeService) {}

  // Método para iniciar reto
  onStartChallenge (): void {
    this.challengeId = ''
    this.showDetails = true

    // this.loadChallengeDetails()
  }

  // Método para cargar los detalles del reto
  // loadChallengeDetails (): void {
  //   this.ChallengeService.getChallengeById(this.challengeId).subscribe(
  //     (challengeDetails: Challenge) => {
  //       // Comparación explícita
  //       if (challengeDetails !== null && challengeDetails !== undefined) {
  //         this.description: = challengeDetails.detail.description
  //         this.examples = challengeDetails.detail.examples || []
  //         this.notes = challengeDetails.detail.notes
  //       }
  //     },
  //     (error: any) => {
  //       console.error('Error al cargar los detalles del reto', error)
  //     }
  //   )
  // }
}
