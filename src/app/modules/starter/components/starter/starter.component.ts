import { type FilterChallenge } from './../../../../models/filter-challenge.model'
import { Component, Inject, type OnInit, ViewChild, type ElementRef } from '@angular/core'
import { type Subscription } from 'rxjs'
import { StarterService } from '../../../../services/starter.service'
import { Challenge } from '../../../../models/challenge.model'
import { environment } from '../../../../../environments/environment'
import { type FiltersModalComponent } from 'src/app/modules/modals/filters-modal/filters-modal.component'
import { TranslateService } from '@ngx-translate/core'
/* import { RouteConfigLoadEnd } from '@angular/router'
 */
@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss'],
  providers: []
})
export class StarterComponent implements OnInit {
  @ViewChild('modal') private readonly modalContent!: FiltersModalComponent
  @ViewChild('challenge') challengesContainer!: ElementRef

  challenges: Challenge[] = []
  params$!: Subscription
  challengesSubs$!: Subscription
  filters: FilterChallenge = { languages: [], levels: [], progress: [] }
  sortBy: string = ''
  challenge = Challenge

  totalPages!: number
  pageNumber: number = 1
  listChallenges: any
  pageSize = environment.pageSize

  selectedSort: string = ''
  isAscending: boolean = false
  startIndex: number = 0
  constructor (
    @Inject(StarterService) private readonly starterService: StarterService,
    @Inject(TranslateService) readonly translate: TranslateService
  ) {}

  ngOnInit (): void {
    this.getChallenge()
  }

  ngOnDestroy (): void {
    if (this.params$ !== undefined) this.params$.unsubscribe()
    if (this.challengesSubs$ !== undefined) this.challengesSubs$.unsubscribe()
  }

  getChallenge (): void {
    this.starterService.getAllChallenges().subscribe({
      next: (resp) => {
        this.listChallenges = resp.results
        console.log('Datos recibidos:', this.listChallenges)

        this.getChallengesByPage(this.pageNumber)

        if (this.filters !== null && Object.keys(this.filters).length > 0) {
          this.getChallengeFilters(this.filters)
        }
      },
      error: (err) => {
        console.error('Error al obtener los desafíos:', err)
      }
    })
  }

  getChallengesByPage (page: number): void {
    this.pageNumber = page
    const startIndex = (this.pageNumber - 1) * this.pageSize

    if (this.filters.languages.length > 0 || this.filters.levels.length > 0 || this.filters.progress.length > 0) {
      this.getChallengeFilters(this.filters)
    } else {
      if (Array.isArray(this.listChallenges) && this.listChallenges.length > 0) {
        this.totalPages = Math.ceil(this.listChallenges.length / this.pageSize)

        if (this.sortBy !== '') {
          this.getAndSortChallenges(startIndex, this.listChallenges)
        }

        if (window.innerWidth < 768) {
          // Para móviles, podrías querer ajustar la lógica según cómo manejas la paginación
          this.challenges = this.listChallenges
        } else {
        // Para escritorio, muestra los desafíos según la paginación
          this.challenges = this.listChallenges.slice(startIndex, startIndex + this.pageSize)
        }

        console.log('Desafíos en la página actual:', this.challenges)
      } else {
        console.warn('No hay desafíos disponibles.')
        this.challenges = []
      }
    }
  }

  openModal (): void {
    this.modalContent.open()
  }

  private getAndSortChallenges (getChallengeOffset: number, resp: any): void {
    const respArray: Challenge[] = Array.isArray(resp) ? resp : [resp]

    const sortedChallenges$ = this.isAscending
      ? this.starterService.orderBySortAscending(this.sortBy, respArray, 0, respArray.length)
      : this.starterService.orderBySortAsDescending(this.sortBy, respArray, 0, respArray.length)

    sortedChallenges$.subscribe(sortedResp => {
      this.listChallenges = sortedResp
      console.log('Todos los desafíos ordenados:', this.listChallenges)
      this.totalPages = Math.ceil(this.listChallenges.length / this.pageSize)
      this.challenges = this.listChallenges.slice(getChallengeOffset, getChallengeOffset + this.pageSize)
      console.log('Desafíos ordenados y en la página actual:', this.challenges)
    })
  }

  getChallengeFilters (filters: FilterChallenge): void {
    this.filters = filters
    if (this.filters.languages.length > 0 || this.filters.levels.length > 0 || this.filters.progress.length > 0) {
      const respArray: Challenge[] = this.listChallenges

      this.starterService.getAllChallengesFiltered(this.filters, respArray).subscribe((filteredResp: Challenge[]) => {
        this.totalPages = Math.ceil(filteredResp.length / this.pageSize)
        this.pageNumber = 1
        const startIndex = (this.pageNumber - 1) * this.pageSize
        console.log('filteredResp:', filteredResp)

        if (window.innerWidth < 768) {
          // Para móviles, podrías querer ajustar la lógica según cómo manejas la paginación
          this.challenges = filteredResp
        } else {
          // Para escritorio, muestra los desafíos según la paginación
          this.challenges = filteredResp.slice(startIndex, startIndex + this.pageSize)
        }
        console.log('Desafíos filtrados y en la página actual:', this.challenges)
      })
    } else {
      this.getChallengesByPage(this.pageNumber)
    }
  }

  changeSort (newSort: string): void {
    this.sortBy = newSort
    if (newSort === 'popularity' || newSort === 'creation_date') {
      if (this.selectedSort === newSort) {
        this.getChallengesByPage(this.pageNumber)
        this.isAscending = !this.isAscending
      } else {
        this.isAscending = false
        this.selectedSort = newSort
        this.getChallengesByPage(this.pageNumber)
        this.isAscending = true
      }
    }
  }
}
