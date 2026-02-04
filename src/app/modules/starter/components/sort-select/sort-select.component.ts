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
}
