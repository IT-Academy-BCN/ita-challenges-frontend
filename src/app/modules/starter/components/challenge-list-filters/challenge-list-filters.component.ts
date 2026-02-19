import { Component, EventEmitter, Input, Output } from '@angular/core'
import { type FilterChallenge } from 'src/app/models/filter-challenge.model'

type ModalFilters = Pick<FilterChallenge, 'levels' | 'tags' | 'progress'>

@Component({
  selector: 'app-challenge-list-filters',
  templateUrl: './challenge-list-filters.component.html',
  styleUrls: ['./challenge-list-filters.component.scss']
})
export class ChallengeListFiltersComponent {
  // REMOVE MOCKED LANGUAGES
  @Input() initialFilters: FilterChallenge = { languages: ['09fabe32-7362-4bfb-ac05-b7bf854c6e0f', '660e1b18-0c0a-4262-a28a-85de9df6ac5f'], levels: [], progress: [], tags: [] }
  @Output() filtersApplied = new EventEmitter<ModalFilters>()
  @Output() sortSelected = new EventEmitter<string>()
  @Output() orderSelected = new EventEmitter<boolean>()
  sortBy: string = 'popularity'
  isAscending: boolean = false
  languageMap: Record<string, string> = {}

  protected onModalFiltersApplied (filters: ModalFilters): void {
    this.filtersApplied.emit(filters)
  }

  changeSort (sort: string): void {
    this.sortBy = sort
    this.sortSelected.emit(sort)
  }

  changeOrder (isAscending: boolean): void {
    this.isAscending = isAscending
    this.orderSelected.emit(isAscending)
  }
}
