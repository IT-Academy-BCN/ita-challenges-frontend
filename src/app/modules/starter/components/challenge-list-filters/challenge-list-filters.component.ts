import { Component, EventEmitter, Input, Output } from '@angular/core'
import { type FilterChallenge } from 'src/app/models/filter-challenge.model'

type ModalFilters = Pick<FilterChallenge, 'levels' | 'tags' | 'progress'>

@Component({
  selector: 'app-challenge-list-filters',
  templateUrl: './challenge-list-filters.component.html',
  styleUrls: ['./challenge-list-filters.component.scss']
})
export class ChallengeListFiltersComponent {
  @Input() initialFilters: FilterChallenge = { languages: [], levels: [], progress: [], tags: [] }
  @Output() allFiltersApplied = new EventEmitter<FilterChallenge>()
  @Output() sortSelected = new EventEmitter<string>()
  @Output() orderSelected = new EventEmitter<boolean>()
  sortBy: string = 'popularity'
  isAscending: boolean = false
  modalFilters: ModalFilters = { levels: [], tags: [], progress: [] } 
  languageFilters: string[] = []

  protected onModalFiltersApplied (filters: ModalFilters): void {
    this.modalFilters = filters
    this.allFiltersApplied.emit({
      ...filters,
      languages: this.languageFilters
    })
    console.log('Applied filters:', {
      ...filters,
      languages: this.languageFilters
    })
  }

  changeSort (sort: string): void {
    this.sortBy = sort
    this.sortSelected.emit(sort)
  }

  changeOrder (isAscending: boolean): void {
    this.isAscending = isAscending
    this.orderSelected.emit(isAscending)
  }

  onLanguageFilterChange (languages: string[]): void {
    this.languageFilters = languages
    this.allFiltersApplied.emit({
      ...this.modalFilters,
      languages
    })
    console.log('Applied filters:', {
      ...this.modalFilters,
      languages
    })
  }
}
