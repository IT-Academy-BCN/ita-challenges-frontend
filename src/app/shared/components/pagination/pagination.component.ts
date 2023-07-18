import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() page!: number;
  @Input() numChallenges!: number;
  @Input() totalPages!: number;

  @Output() paginaEmitter: EventEmitter<number> =  new EventEmitter();

  constructor() { }

  ngOnInit() {}

 next(){
    this.page++;
    this.changePage();
  }

prev(){
    this.page--;
    this.changePage();
  }

 changePage(){
    this.paginaEmitter.emit(this.page);
  }
}
