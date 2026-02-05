import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, inject } from '@angular/core'
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule } from '@ngx-translate/core'
import { type FilterChallenge } from 'src/app/models/filter-challenge.model'

type ModalFilters = Pick<FilterChallenge, 'levels' | 'tags' | 'progress'>

@Component({
  selector: 'app-challenge-filters-trigger',
  standalone: true,
  imports: [CommonModule, NgbModalModule, TranslateModule],
  templateUrl: './challenge-filters-trigger.component.html',
  styleUrls: ['./challenge-filters-trigger.component.scss']
})

export class ChallengeFiltersTriggerComponent {

  @Input() initialFilters: FilterChallenge = { languages: [], levels: [], progress: [], tags: [] }
  @Output() filtersApplied = new EventEmitter<ModalFilters>()
  @ViewChild('modal') private readonly modalTemplate!: TemplateRef<unknown>

  private readonly modalService = inject(NgbModal)

  private draftFilters: ModalFilters = { levels: [], tags: [], progress: [] }

  open(): void {
    this.draftFilters = {
      levels: [...this.initialFilters.levels],
      tags: [...(this.initialFilters.tags ?? [])],
      progress: [...this.initialFilters.progress]
    }
    this.modalService.open(this.modalTemplate, { size: 'lg' })
  }

  onApply(): void {
    this.filtersApplied.emit(this.draftFilters)
    this.modalService.dismissAll()
  }

  onCancel(): void {
    this.modalService.dismissAll()
  }
}