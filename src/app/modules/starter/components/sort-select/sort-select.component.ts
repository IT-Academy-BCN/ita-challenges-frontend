import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-sort-select',
  templateUrl: './sort-select.component.html',
  styleUrls: ['./sort-select.component.scss']
})
export class SortSelectComponent {
  @Input() sortBy: string = ''
  @Input() isAscending: boolean = false
  @Output() sortSelected = new EventEmitter<string>()
  @Output() orderSelected = new EventEmitter<boolean>()

  selectSort (sortValue: string): void {
    if (this.sortBy !== sortValue) {
      this.sortSelected.emit(sortValue)
    }
  }

  selectOrder (isAscending: boolean): void {
    if (this.isAscending !== isAscending) {
      this.orderSelected.emit(isAscending)
    }
  }

  private readonly sortConfig: Record<string, string> = {
    popularity: 'modules.starter.main.section3.popularity',
    creation_date: 'modules.starter.main.section3.date',
    likes: 'modules.starter.main.section3.likes',
    difficulty: 'modules.starter.main.section3.difficulty'
  }

  get currentSortLabel (): string {
    return this.sortConfig[this.sortBy] ?? 'modules.starter.main.section3.sort'
  }
}
