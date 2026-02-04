import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, inject } from '@angular/core'
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap'
import { type FilterChallenge } from 'src/app/models/filter-challenge.model'

@Component({
  selector: 'app-challenge-filters-trigger',
  standalone: true,
  imports: [CommonModule, NgbModalModule],
  templateUrl: './challenge-filters-trigger.component.html',
  styleUrls: ['./challenge-filters-trigger.component.scss']
})

export class ChallengeFiltersTriggerComponent {
  @Input() initialFilters: FilterChallenge = { languages: [], levels: [], progress: [] }
  @Output() filtersApplied = new EventEmitter<FilterChallenge>()
  @ViewChild('modal') private readonly modalTemplate!: TemplateRef<unknown>

  private readonly modalService = inject(NgbModal)

  open(): void {
    this.modalService.open(this.modalTemplate, { size: 'lg' })
  }

  onApply(): void {
    // Sub-task 1: no implementamos todavía UI de filtros.
    // Emitimos el estado actual (por ahora el initial) para validar wiring si se integra.
    this.filtersApplied.emit(this.initialFilters)
    this.modalService.dismissAll()
  }

  onCancel(): void {
    this.modalService.dismissAll()
  }
}