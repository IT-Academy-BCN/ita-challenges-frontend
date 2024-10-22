import { type FilterChallenge } from './../../../../models/filter-challenge.model'
import { Component, Inject, type OnInit, ViewChild, type ElementRef } from '@angular/core'
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
export class StarterComponent implements OnInit {
  @ViewChild('modal') private readonly modalContent!: FiltersModalComponent
  @ViewChild('challenges') challengesContainer!: ElementRef

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
  isLoading: boolean = false
  constructor (
    @Inject(StarterService) private readonly starterService: StarterService,
    @Inject(TranslateService) readonly translate: TranslateService
  ) {
    /*    this.params$ = this.activatedRoute.params.subscribe(params => {

    }) */
  }

  ngOnInit (): void {
    this.getChallengesByPage(this.pageNumber)
  }

  ngOnDestroy (): void {
    if (this.params$ !== undefined) this.params$.unsubscribe()
    if (this.challengesSubs$ !== undefined) this.challengesSubs$.unsubscribe()
  }

  getChallengesByPage (page: number): void {
    const getChallengeOffset = 8 * (page - 1)
    console.log(getChallengeOffset)
    this.pageNumber = page
    console.log(this.pageNumber)
    if (this.filters.languages.length > 0 || this.filters.levels.length > 0 || this.filters.progress.length > 0) {
      this.getChallengeFilters(this.filters)
    } else {
      const challengesObservable = this.sortBy !== ''
        ? this.starterService.getAllChallenges()
        : this.starterService.getAllChallengesOffset(getChallengeOffset, this.pageSize)

      this.challengesSubs$ = challengesObservable.subscribe(resp => {
        if (this.sortBy !== '') {
          this.getAndSortChallenges(getChallengeOffset, resp)
          this.isLoading = false
        } else {
          this.listChallenges = resp
          console.log(this.listChallenges)
          this.totalPages = Math.ceil(22 / this.pageSize) // Cambiar 22 por el valor de challenge.count
          this.isLoading = false
        }
        this.isLoading = false
      })
    }
  }

  openModal (): void {
    this.modalContent.open()
  }

  private getAndSortChallenges (getChallengeOffset: number, resp: any): void {
    const respArray: Challenge[] = Array.isArray(resp) ? resp : [resp]
    const sortedChallenges$ = this.isAscending
      ? this.starterService.orderBySortAscending(this.sortBy, respArray, getChallengeOffset, this.pageSize)
      : this.starterService.orderBySortAsDescending(this.sortBy, respArray, getChallengeOffset, this.pageSize)

    sortedChallenges$.subscribe(sortedResp => {
      this.listChallenges = sortedResp
      this.totalPages = Math.ceil(respArray.length / this.pageSize)
    })
  }

  getChallengeFilters (filters: FilterChallenge): void {
    if (this.filters !== filters) {
      this.pageNumber = 1
    }
    const getChallengeOffset = 8 * (this.pageNumber - 1)
    this.filters = filters
    if (this.filters.languages.length > 0 || this.filters.levels.length > 0 || this.filters.progress.length > 0) {
      const challengesObservable = (this.filters.languages.length > 0 && this.filters.languages.length < 4) || (this.filters.levels.length > 0 && this.filters.levels.length < 3) || (this.filters.progress.length > 0 && this.filters.progress.length < 3)
        ? this.starterService.getAllChallenges()
        : this.starterService.getAllChallengesOffset(getChallengeOffset, this.pageSize)

      this.challengesSubs$ = challengesObservable.subscribe(resp => {
        if ((this.filters.languages.length > 0 && this.filters.languages.length < 4) || (this.filters.levels.length > 0 && this.filters.levels.length < 3) || (this.filters.progress.length > 0 && this.filters.progress.length < 3)) {
          const respArray: Challenge[] = Array.isArray(resp) ? resp : [resp]
          this.starterService.getAllChallengesFiltered(this.filters, respArray)
            .subscribe((filteredResp: Challenge[]) => {
              if (this.sortBy !== '') {
                const orderBySortFunction = this.isAscending ? this.starterService.orderBySortAscending : this.starterService.orderBySortAsDescending
                if (filteredResp.every(item => item instanceof Challenge)) {
                  orderBySortFunction(this.sortBy, filteredResp, getChallengeOffset, this.pageSize).subscribe(sortedResp => {
                    this.listChallenges = sortedResp
                    this.totalPages = Math.ceil(filteredResp.length / this.pageSize)
                    this.isLoading = false
                  })
                } else {
                  console.error('filteredResp no es un array de Challenge')
                }
              } else {
                this.listChallenges = filteredResp.slice(getChallengeOffset, getChallengeOffset + this.pageSize)
                this.totalPages = Math.ceil(filteredResp.length / this.pageSize)
                this.isLoading = false
              }
            })
        } else {
          this.listChallenges = resp
          this.totalPages = Math.ceil(22 / this.pageSize) // Cambiar 22 por el valor de challenge.count
          this.isLoading = false
        }
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

  ngAfterViewInit (): void {
    this.initScrollEvent()
  }

  onScroll (): void {
    const scrollTop = this.challengesContainer.nativeElement.scrollTop
    const containerHeight = this.challengesContainer.nativeElement.clientHeight
    const scrollHeight = this.challengesContainer.nativeElement.scrollHeight

    // Verificar si ya está cargando para evitar múltiples llamadas
    if (this.isLoading) {
      return
    }
    // Condición para cargar la siguiente página al llegar al final del contenedor
    if (scrollTop + containerHeight >= scrollHeight) {
      this.pageNumber++
      this.isLoading = true // Activar bandera de carga
      console.log(this.pageNumber)
      this.getChallengesByPage(this.pageNumber)
    }

    // Condición para cargar la página anterior al llegar al principio del contenedor
    if (scrollTop <= 0 && this.pageNumber > 1) {
      this.pageNumber--
      this.isLoading = true // Activar bandera de carga
      console.log(this.pageNumber)
      this.getChallengesByPage(this.pageNumber)
    }
  }

  // Método para inicializar el evento de scroll
  initScrollEvent (): void {
    if (window.innerWidth < 768) {
      this.challengesContainer.nativeElement.addEventListener('scroll', () => {
        this.onScroll()
      })
    }
  }
}
