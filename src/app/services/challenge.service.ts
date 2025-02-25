import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { type Itinerary } from '../models/itinerary.interface'
import { environment } from 'src/environments/environment'
import { type Challenge } from '../models/challenge.model'
import { type Language } from '../models/language.model'
import { type CreateChallenge } from '../models/create-challenge.interface'


// import {environment} from "../../environments/environment";
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private challengeStarted: boolean = false
  private readonly challengeStartedSubject = new BehaviorSubject<boolean>(this.getChallengeStartedFromStorage())

  constructor (@Inject(HttpClient) private readonly http: HttpClient) {
    this.checkChallengeStartedFromStorage()
  }

  get challengeStarted$ (): Observable<boolean> {
    return this.challengeStartedSubject.asObservable()
  }

  onStartChallenge (): void {
    this.challengeStartedSubject.next(true)
    localStorage.setItem('challengeStarted', 'true')
  }

  openSendSolutionModal (): void {
    this.challengeStartedSubject.next(false)
    localStorage.setItem('challengeStarted', 'false')
  }

  private getChallengeStartedFromStorage (): boolean {
    return localStorage.getItem('challengeStarted') === 'true'
  }

  // Método para verificar si el reto ha sido iniciado desde el almacenamiento local
  checkChallengeStartedFromStorage (): void {
    const storedState = localStorage.getItem('challengeStarted')
    if (storedState !== null && storedState !== '') {
      this.challengeStarted = JSON.parse(storedState)
    }
  }

  getChallengeById (id: string): Observable<Challenge> {
    return this.http.get<Challenge>(
      `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}/${id}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }


    createChallenge (challenge: CreateChallenge): Observable<any> {
      const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`
      console.log('URL completa:', url) // Para depurar
      return this.http.post(url, challenge)
    }

    
  async getItineraries (): Promise<Itinerary[]> {
    return await new Promise((resolve, reject) =>
      this.http
        .get<Itinerary[]>(
        environment.BACKEND_ITA_SSO_BASE_URL.concat(
          environment.BACKEND_SSO_ITINERARIES
        )
      )
        .subscribe({
          next: (res) => {
            resolve(res)
          },
          error: (err) => {
            reject(err)
          }
        })
    )
  }

  getAllLanguages (): Observable<Language> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.http.get<Language>(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_LANGUAGE_URL}`,
      {
        headers
      })
  }

  // Form-challenge
  createChallenge (challenge: CreateChallenge): Observable<any> {
    const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES_URL}`
    console.log('URL completa:', url) // Para depurar
    return this.http.post(url, challenge)
  }
}
