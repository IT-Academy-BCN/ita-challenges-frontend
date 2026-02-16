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
  @Output() filtersApplied = new EventEmitter<ModalFilters>()

  protected onModalFiltersApplied(filters: ModalFilters): void {
    this.filtersApplied.emit(filters)
  }
}
