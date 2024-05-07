import { type FilterChallenge } from './../../../../models/filter-challenge.model'
import { Component, Inject, ViewChild } from '@angular/core'
import { type Subscription } from 'rxjs'
import { StarterService } from '../../../../services/starter.service'
import { Challenge } from '../../../../models/challenge.model'
import { environment } from '../../../../../environments/environment'
import { type FiltersModalComponent } from 'src/app/modules/modals/filters-modal/filters-modal.component'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss'],
  providers: []
})
export class StarterComponent {
  @ViewChild('modal') private readonly modalContent!: FiltersModalComponent

  challenges: Challenge[] = []
  params$!: Subscription
  challengesSubs$!: Subscription
  filters!: FilterChallenge
  sortBy: string = ''
  challenge = Challenge

  totalPages!: number
  pageNumber: number = 1
  listChallenges: any
  pageSize = environment.pageSize

  selectedSort: string = ''
  isAscending: boolean = false

  constructor(
    @Inject(StarterService) private readonly starterService: StarterService,
    @Inject(TranslateService) readonly translate: TranslateService
  ) {
    /*    this.params$ = this.activatedRoute.params.subscribe(params => {

    }) */
  }

  ngOnInit(): void {
    this.getChallengesByPage(this.pageNumber)
  }

  ngOnDestroy(): void {
    if (this.params$ !== undefined) this.params$.unsubscribe()
    if (this.challengesSubs$ !== undefined) this.challengesSubs$.unsubscribe()
  }

  getChallengesByPage(page: number): void {
    const getChallengeOffset = (8 * (page - 1))
    this.pageNumber = page

    if (this.sortBy !== '') {
      this.challengesSubs$ = this.starterService.getAllChallenges()
        .subscribe(resp => {
          const respArray: any[] = Array.isArray(resp) ? resp : [resp]
          if (this.isAscending) {
            this.starterService.orderBySortAscending(this.sortBy, respArray, getChallengeOffset, this.pageSize)
              .subscribe(resp => {
                this.listChallenges = resp
              })
            this.totalPages = Math.ceil(respArray.length / this.pageSize)
          } else {
            this.starterService.orderBySortAsDescending(this.sortBy, respArray, getChallengeOffset, this.pageSize)
              .subscribe(resp => {
                this.listChallenges = resp
              })
            this.totalPages = Math.ceil(respArray.length / this.pageSize)
          }
        })
    } else {
      this.challengesSubs$ = this.starterService.getAllChallengesOffset(getChallengeOffset, this.pageSize)
        .subscribe(resp => {
          this.listChallenges = resp
          this.totalPages = Math.ceil(22 / this.pageSize)
        })
    }
  }

  openModal(): void {
    this.modalContent.open()
  }

  getChallengeFilters(filters: FilterChallenge): void {
    this.filters = filters
    // TODO: llamar al endpoint
  }

  changeSort(newSort: string): void {
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
