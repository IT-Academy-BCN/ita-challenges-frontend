import { Component, Output, EventEmitter } from '@angular/core';
import { FilterChallenge } from 'src/app/models/filter-challenge.model';

@Component({
  selector: 'app-starter-filters',
  templateUrl: './starter-filters.component.html',
  styleUrls: ['./starter-filters.component.scss']
})
export class StarterFiltersComponent {

  @Output() filtersSelected = new EventEmitter<FilterChallenge>();

  checkFilter(){
    let filters = this.getAllFilters();
    this.filtersSelected.emit(filters);
    console.log('llamada emmit componente hijo:' + filters);
  }


  getAllFilters(){

    let filters: FilterChallenge = {languages: [], levels: [], progress: []};

    let languageFilters = document.getElementsByName('language');
    let levelFilters = document.getElementsByName('level');
    /* let progressFilters = document.getElementsByName('progress'); */

    languageFilters.forEach(element => {

      let filter = (element as HTMLInputElement);

      if(filter.checked) filters.languages.push(Number(filter.value));
      
    });

    levelFilters.forEach(element => {

      let filter = (element as HTMLInputElement);

      if(filter.checked) filters.levels.push(filter.value);
      
    });

    /* progressFilters.forEach(element => {

      let filter = (element as HTMLInputElement);
      if(filter.checked) filters.progress.push(Number(filter.value));
      
    }); */
    return filters;
  }
}
