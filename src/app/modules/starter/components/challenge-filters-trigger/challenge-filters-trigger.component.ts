import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, inject } from '@angular/core'
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule } from '@ngx-translate/core'
import { type FilterChallenge } from 'src/app/models/filter-challenge.model'
import { SolutionStatus } from 'src/app/models/user-solution-status.enum'

type ModalFilters = Pick<FilterChallenge, 'levels' | 'tags' | 'progress'>
type Level = NonNullable<FilterChallenge['levels']>[number]

@Component({
  selector: 'app-challenge-filters-trigger',
  standalone: true,
  imports: [CommonModule, NgbModalModule, TranslateModule],
  templateUrl: './challenge-filters-trigger.component.html',
  styleUrls: ['./challenge-filters-trigger.component.scss']
})

export class ChallengeFiltersTriggerComponent {

  protected readonly SolutionStatus = SolutionStatus

  @Input() initialFilters: FilterChallenge = { languages: [], levels: [], progress: [], tags: [] }
  @Output() filtersApplied = new EventEmitter<ModalFilters>()
  @ViewChild('modal') private readonly modalTemplate!: TemplateRef<unknown>

  private readonly modalService = inject(NgbModal)

  private draftFilters: ModalFilters = { levels: [], tags: [], progress: [] }

  get selectedFiltersCount(): number {
    return this.initialFilters.levels.length + this.initialFilters.progress.length + (this.initialFilters.tags?.length ?? 0)
  }

  private toggleInArray<T>(arr: T[], value: T): T[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
  }

  isLevelSelected(level: Level): boolean {
    return this.draftFilters.levels.includes(level)
  }

  toggleLevel(level: Level): void {
    this.draftFilters = {
      ...this.draftFilters,
      levels: this.toggleInArray(this.draftFilters.levels, level)
    }
  }

  isProgressSelected(status: SolutionStatus): boolean {
    return this.draftFilters.progress.includes(status)
  }

  toggleProgress(status: SolutionStatus): void {
    this.draftFilters = {
      ...this.draftFilters,
      progress: this.toggleInArray(this.draftFilters.progress, status)
    }
  }

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