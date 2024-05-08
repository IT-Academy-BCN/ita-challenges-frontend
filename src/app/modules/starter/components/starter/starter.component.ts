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
  styleUrls: ['./starter.component.scss']
})
export class StarterComponent {
  @ViewChild('modal') private readonly modalContent!: FiltersModalComponent

  challenges: Challenge[] = []
  params$!: Subscription
  challengesSubs$!: Subscription
  filters!: FilterChallenge
  sortBy: string = 'popularity'
  challenge = Challenge

  totalPages!: number
  pageNumber: number = 1
  listChallenges: any
  pageSize = environment.pageSize

  constructor (
    @Inject(StarterService) private readonly starterService: StarterService,
    @Inject(TranslateService) readonly translate: TranslateService
  ) {
    /*    this.params$ = this.activatedRoute.params.subscribe(params => {

    }) */
  }

  ngOnInit (): void {
    this.getChallengesByPage(1)
  }

  ngOnDestroy (): void {
    if (this.params$ !== undefined) this.params$.unsubscribe()
    if (this.challengesSubs$ !== undefined) this.challengesSubs$.unsubscribe()
  }

  getChallengesByPage (page: number): void {
    const getChallengeOffset = (8 * (page - 1))
    this.challengesSubs$ = this.starterService.getAllChallenges(getChallengeOffset, this.pageSize)
      .subscribe( resp => {
        this.listChallenges = resp
        this.totalPages = Math.ceil(22 / this.pageSize)
        // TODO: change the list challenges and total pages when the changes come from the back end:
        // this.listChallenges = resp.results
        // this.totalPages = Math.ceil(resp.count/this.pageSize);
      })
  }

  openModal (): void {
    this.modalContent.open()
  }

  getChallengeFilters (filters: FilterChallenge): void {
    this.filters = filters
    // TODO: llamar al endpoint
  }

  changeSort (newSort: string): void {
    if (newSort !== this.sortBy) {
      this.sortBy = newSort
      // TODO: llamar al endpoint
    }
  }
}
