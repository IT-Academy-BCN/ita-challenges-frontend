import { Component, EventEmitter, Input, Output } from '@angular/core'
import { totalmem } from 'os'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  @Input() challengeOffset!: number
  @Input() pageNumber!: number
  @Input() totalPages!: number

  @Output() pageEmitter = new EventEmitter<number>()

  next(): void {
    if (this.pageNumber !== this.totalPages) {
      console.log('next', this.pageNumber, this.totalPages)
      this.pageNumber++
      this.changePage()

    }
  }

  prev(): void {
    if (this.pageNumber !== 1  ) {
      this.pageNumber--
      this.changePage()
    }
  }

  changePage(): void {
    this.pageEmitter.emit(this.pageNumber)
  }

  setPageOffset(page: number): void {
    console.log(page, 'PAGE')
    this.pageNumber = page
    this.pageEmitter.emit(page)
  }
}
