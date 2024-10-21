import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core'

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() pageNumber!: number
  @Input() totalPages!: number

  @Output() pageEmitter = new EventEmitter<number>()
  private readonly scrollThreshold = 50
  next (): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++
      this.changePage()
    }
  }

  prev (): void {
    if (this.pageNumber !== 1 && this.pageNumber > 0) {
      this.pageNumber--
      this.changePage()
    }
  }

  changePage (): void {
    this.pageEmitter.emit(this.pageNumber)
  }

  setPageOffset (page: number): void {
    this.pageNumber = page
    this.pageEmitter.emit(page)
  }

  // Método para detectar el scroll
  @HostListener('scroll', ['$event'])
  onScroll (event: Event): void {
    const scrollTop = (event.target as HTMLElement).scrollTop
    const scrollHeight = (event.target as HTMLElement).scrollHeight
    const clientHeight = (event.target as HTMLElement).clientHeight

    // Si se desplaza hacia abajo
    if (scrollHeight - scrollTop - clientHeight <= this.scrollThreshold) {
      this.next()
    }

    // Si se desplaza hacia arriba
    if (scrollTop <= this.scrollThreshold) {
      this.prev()
    }
  }
}
