import { Component, OnInit, Output, Input, ViewChild, TemplateRef, EventEmitter, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterChallenge } from 'src/app/models/filter-challenge.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html',
  styleUrls: ['./filters-modal.component.scss']
})
export class FiltersModalComponent {

  @Output() filtersSelected = new EventEmitter<FilterChallenge>();

  filtersForm;

  private fb = inject(FormBuilder);
  public modalService = inject(NgbModal);

  constructor() {
    this.filtersForm = this.fb.nonNullable.group({
      languages: this.fb.nonNullable.group({
        javascript: false,
        java: false,
        php: false,
        python: false
      }),
      levels: this.fb.nonNullable.group({
        easy: false,
        medium: false,
        hard: false
      }),
      progress: this.fb.nonNullable.group({
        noStarted: false,
        started: false,
        finished: false
      })
    });


  }
  
  applyFiltersAndClose(str: string) {
    let filters: FilterChallenge = {languages: [], levels: [], progress: []};
      Object.values(this.filtersForm.value.languages!).forEach((val, i) => {
        if (val == true) { filters.languages.push(i+1) }
      });
      Object.entries(this.filtersForm.value.levels!).forEach(([key, val]) => {
      if (val == true) { filters.levels.push(key) }
          });
      Object.values(this.filtersForm.value.progress!).forEach((val, i) => {
      if (val == true) { filters.progress.push(i+1) }
      });
      this.filtersSelected.emit(filters);
      console.log('llamada emmit componente hijo:' + filters.languages, filters.levels, filters.progress);
      this.modalService.dismissAll();
  }

}
