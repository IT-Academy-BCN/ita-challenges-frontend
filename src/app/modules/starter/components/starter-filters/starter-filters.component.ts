import { Component, Output, EventEmitter } from '@angular/core';
import { filterChallenge } from 'src/app/models/filter-challenge.model';

@Component({
  selector: 'app-starter-filters',
  templateUrl: './starter-filters.component.html',
  styleUrls: ['./starter-filters.component.scss']
})
export class StarterFiltersComponent {

  @Output() filtersSelected = new EventEmitter<filterChallenge>();

  checkFilter(){
    let filters = this.getAllFilters();
    this.filtersSelected.emit(filters);
  }

  getAllFilters(){

    let filters: filterChallenge = {languages: [], levels: [], progress: []};

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
