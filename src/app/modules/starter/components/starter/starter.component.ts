import { type FilterChallenge } from './../../../../models/filter-challenge.model'
import { Component, Inject, type OnInit, ViewChild, type ElementRef } from '@angular/core'
import { type Subscription } from 'rxjs'
import { StarterService } from '../../../../services/starter.service'
import { Challenge } from '../../../../models/challenge.model'
import { environment } from '../../../../../environments/environment'
import { type FiltersModalComponent } from 'src/app/modules/modals/filters-modal/filters-modal.component'
import { TranslateService } from '@ngx-translate/core'
import { AuthService } from 'src/app/services/auth.service'
import * as bootstrap from 'bootstrap'

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss'],
  providers: []
})
export class StarterComponent implements OnInit {
  @ViewChild('modal') private readonly modalContent!: FiltersModalComponent
  @ViewChild('challenge') challengesContainer!: ElementRef
  @ViewChild('challengeFormModal') challengeFormModal!: ElementRef;

  challenges: Challenge[] = []
  challengesSubs$!: Subscription
  sortedChallengesSubs$!: Subscription
  filteredChallengesSubs$!: Subscription
  userRoleSubs$!: Subscription
  filters: FilterChallenge = { languages: [], levels: [], progress: [] }
  sortBy: string = ''
  challenge = Challenge

  
  
  listChallenges: Challenge[] = []
 
  selectedSort: string = ''
  isAscending: boolean = false
  
  
  isMobile: boolean = window.innerWidth < 768
  isAdmin: boolean = false;

  constructor (
    @Inject(StarterService) private readonly starterService: StarterService,
    @Inject(TranslateService) readonly translate: TranslateService,
    private _authService: AuthService
  ) {}

  ngOnInit (): void {
    this.getChallenge()
    this.userRoleSubs$ = this._authService.getUserRole().subscribe(role => {
      this.isAdmin = role === 'ADMIN'
    })
  }

  ngOnDestroy (): void {
    if (this.challengesSubs$ !== undefined) this.challengesSubs$.unsubscribe()
    if (this.filteredChallengesSubs$ !== undefined) this.filteredChallengesSubs$.unsubscribe()
    if (this.sortedChallengesSubs$ !== undefined) this.sortedChallengesSubs$.unsubscribe()
    if (this.userRoleSubs$ !== undefined) this.userRoleSubs$.unsubscribe()
  }

  getChallenge (): void {
    this.challengesSubs$ = this.starterService.getAllChallenges().subscribe({
      next: (resp) => {
        this.listChallenges = resp.results
        console.log('Datos recibidos:', this.listChallenges)

        this.getChallengesByPage(this.pageNumber)
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

        this.challenges = this.isMobile
          ? this.listChallenges
          : this.listChallenges.slice(startIndex, startIndex + this.pageSize)

        if (this.sortBy !== '') {
          this.sortedChallengesSubs$ = this.starterService.orderBySort(this.sortBy, this.listChallenges, startIndex, this.pageSize, this.isAscending).subscribe(sortedResp => {
            this.challenges = sortedResp
          })
        }
      } else {
        this.challenges = []
      }
    }
  }

  openModal (): void {
    this.modalContent.open()
  }

  getChallengeFilters (filters: FilterChallenge): void {
    this.filters = filters
    const respArray: Challenge[] = this.listChallenges

    this.filteredChallengesSubs$ = this.starterService.getAllChallengesFiltered(this.filters, respArray).subscribe((filteredResp: Challenge[]) => {
      this.paginationFilters = filteredResp
    })

    this.totalPages = Math.ceil(this.paginationFilters.length / this.pageSize)
    if (this.pageNumber > this.totalPages) {
      this.pageNumber = this.totalPages
    }
    const startIndex = (this.pageNumber - 1) * this.pageSize

    this.challenges = this.isMobile
      ? this.paginationFilters
      : this.paginationFilters.slice(startIndex, startIndex + this.pageSize)

    if (this.sortBy !== '') {
      this.sortedChallengesSubs$ = this.starterService.orderBySort(this.sortBy, this.paginationFilters, startIndex, this.pageSize, this.isAscending).subscribe(sortedResp => {
        this.challenges = sortedResp
      })
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
