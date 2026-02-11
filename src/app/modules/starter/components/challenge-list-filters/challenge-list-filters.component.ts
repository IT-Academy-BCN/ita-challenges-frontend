import { Component, EventEmitter, Output } from '@angular/core'

@Component({
  selector: 'app-challenge-list-filters',
  templateUrl: './challenge-list-filters.component.html',
  styleUrl: './challenge-list-filters.component.scss'
})
export class ChallengeListFiltersComponent {
  sortBy: string = 'popularity'
  isAscending: boolean = false

  @Output() sortSelected = new EventEmitter<string>()
  @Output() orderSelected = new EventEmitter<boolean>()

  changeSort (sort: string): void {
    this.sortBy = sort
    this.sortSelected.emit(sort)
  }

  changeOrder (isAscending: boolean): void {
    this.isAscending = isAscending
    this.orderSelected.emit(isAscending)
  }
}
