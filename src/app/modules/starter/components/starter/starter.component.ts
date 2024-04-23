import { type FilterChallenge } from './../../../../models/filter-challenge.model'
import { Component, Inject, ViewChild } from '@angular/core'
import { finalize, type Subscription } from 'rxjs'
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

  challengeOffset: number = 1
  totalPages!: number
  pageNumber!: number
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
    this.getChallengesByPage(this.challengeOffset)
  }

  ngOnDestroy (): void {
    if (this.params$ !== undefined) this.params$.unsubscribe()
    if (this.challengesSubs$ !== undefined) this.challengesSubs$.unsubscribe()
  }

  getChallengesByPage (page: number): void {
    this.challengesSubs$ = this.starterService.getAllChallenges(page, this.pageSize)
    .pipe(
      finalize( () => {})
    )
    .subscribe(resp => {
    
console.log(resp)
      this.listChallenges = resp
      this.totalPages = Math.ceil(22/this.pageSize);
      this.challengeOffset = 1
      this.pageNumber = Math.floor((this.challengeOffset - 1) / this.pageSize) + 1; 
      console.log(this.pageNumber, 'PAGE NUMM FUNC') 

      // this.totalPages = Math.ceil(resp.ceil/this.pageSize);
      // this.challengeOffset = resp.offset
      // this.pageNumber = Math.floor((this.challengeOffset - 1) / this.pageSize) + 1; 
      ;  
      
      
    })
  }

  openModal (): void {
    this.modalContent.open()
  }

  goToPage (page: number): void {
    this.challengeOffset = page
    console.log(page, this.challengeOffset, 'goToPage')
    this.getChallengesByPage(page)
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
