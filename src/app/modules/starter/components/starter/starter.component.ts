import { type FilterChallenge } from './../../../../models/filter-challenge.model'
import { Component, ViewChild, inject } from '@angular/core'
import { type Subscription } from 'rxjs'
import { type DataChallenge } from '../../../../models/data-challenge.model'
import { Challenge } from '../../../../models/challenge.model'
import { environment } from '../../../../../environments/environment'
import { type FiltersModalComponent } from 'src/app/modules/modals/filters-modal/filters-modal.component'
import { ActivatedRoute, Router } from '@angular/router'
import { StarterService } from 'src/app/services/starter.service'

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss']
})
export class StarterComponent {
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly starterService = inject(StarterService)
  // private authService: AuthService

  @ViewChild('modal') private readonly modalContent!: FiltersModalComponent

  dataChallenge!: DataChallenge
  challenges: Challenge[] = []
  params$!: Subscription
  challengesSubs$!: Subscription
  filters!: FilterChallenge
  sortBy: string = 'popularity'
  challenge = Challenge

  page: number = 1
  totalPages!: number
  numChallenges!: number
  listChallenges: any
  pageSize = environment.pageSize

  constructor () {
    this.params$ = this.activatedRoute.params.subscribe(params => {
    })
  }

  ngOnInit (): void {
    this.getChallengesByPage(this.page)
  }

  ngOnDestroy (): void {
    if (this.params$ !== undefined) this.params$.unsubscribe()
    if (this.challengesSubs$ !== undefined) this.challengesSubs$.unsubscribe()
  }

  getChallengesByPage (page: number): void {
    this.challengesSubs$ = this.starterService.getAllChallenges(page, this.pageSize).subscribe(resp => {
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TODO DEVELOPMENT ONLY ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // console.log('User Starter Component: ' + this.authService.currentUser.idUser);

      /*      if(this.authService.currentUser.idUser === 'anonym') {
        const loggedUser: User = new User('', '32983483B', 'rU2GiuiTf3oj2RvQjMQX8EyozA7k2ehTp8YIUGSWOL3TdZcn7jaq7vG8z5ovfo6NMr77');
        this.authService.login(loggedUser);
        console.log(this.authService.currentUser.idUser);
      } */

      this.listChallenges = resp
    })
  }

  openModal (): void {
    this.modalContent.open()
  }

  goToPage (page: number): void {
    this.page = page
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
