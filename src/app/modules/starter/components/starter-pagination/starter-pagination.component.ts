import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-starter-pagination',
  templateUrl: './starter-pagination.component.html',
  styleUrls: ['./starter-pagination.component.scss']
})
export class StarterPaginationComponent {
  @Input() page!: number;

  @Input() numChallenges!: number;
  @Input() totalPages!: number;

  @Output() paginaEmitter: EventEmitter<number> =  new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  siguiente(){

    this.page++;

    this.pasarPagina();

  }

  anterior(){

    this.page--;

    this.pasarPagina();

  }

  pasarPagina(){

    this.paginaEmitter.emit(this.page);

  }

}
