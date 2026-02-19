import { CommonModule } from '@angular/common'
import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild, inject } from '@angular/core'
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule } from '@ngx-translate/core'
import { type FilterChallenge } from 'src/app/models/filter-challenge.model'
import { SolutionStatus } from 'src/app/models/user-solution-status.enum'
import { ChallengeFormService } from 'src/app/services/challenge-form.service'

type ModalFilters = Pick<FilterChallenge, 'levels' | 'tags' | 'progress'>
type Level = NonNullable<FilterChallenge['levels']>[number]
type TagItem = { id: string; name: string }
type LanguageTags = { language: string; tags: TagItem[] }

@Component({
  selector: 'app-challenge-filters-trigger',
  standalone: true,
  imports: [CommonModule, NgbModalModule, TranslateModule],
  templateUrl: './challenge-filters-trigger.component.html',
  styleUrls: ['./challenge-filters-trigger.component.scss']
})

export class ChallengeFiltersTriggerComponent {
  private readonly challengeFormService = inject(ChallengeFormService)
  protected readonly SolutionStatus = SolutionStatus

  displayTags: LanguageTags[] = []

  @Input() initialFilters: FilterChallenge = { languages: [], levels: [], progress: [], tags: [] }
  @Input() languageMap: Record<string, string> = {}
  @Output() filtersApplied = new EventEmitter<ModalFilters>()
  @ViewChild('modal') private readonly modalTemplate!: TemplateRef<unknown>
  @ViewChild('triggerBtn') private readonly triggerBtn!: ElementRef<HTMLButtonElement>

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
  
  isTagSelected(tag: string): boolean {
    return (this.draftFilters.tags ?? []).includes(tag)
  }

  toggleTag(tag: string): void {
    this.draftFilters = {
      ...this.draftFilters,
      tags: this.toggleInArray(this.draftFilters.tags ?? [], tag)
    }
  }

  fetchTags(): void {
    this.displayTags = []
    for (const language of this.initialFilters.languages) {
      this.challengeFormService.getTagsByLanguage(language).subscribe((tags) => {
        const tagItems = tags.results.map((tag) => ({ id: tag.id_tag, name: tag.tag_name }))
        const languageName = this.languageMap[language] ?? language
        this.displayTags.push({ language: languageName, tags: tagItems })
      })
    }
  }

  open(): void {
    this.draftFilters = {
      levels: [...this.initialFilters.levels],
      tags: [...(this.initialFilters.tags ?? [])],
      progress: [...this.initialFilters.progress]
    }

    this.fetchTags()

    this.modalService.open(this.modalTemplate, {
      windowClass: 'challenge-filters-trigger-modal',
      backdrop: 'static',
      keyboard: false
    })

    setTimeout(() => {
      const triggerEl = this.triggerBtn?.nativeElement
      const dialogEl = document.querySelector('.challenge-filters-trigger-modal .modal-dialog') as HTMLElement | null

      if (!triggerEl || !dialogEl) {
        return
      }

      const gapPx = 16
      const rect = triggerEl.getBoundingClientRect()

      dialogEl.style.position = 'fixed'
      dialogEl.style.margin = '0'
      dialogEl.style.top = `${Math.round(rect.bottom + gapPx)}px`
      dialogEl.style.right = `${Math.round(window.innerWidth - rect.right)}px`
      dialogEl.style.left = 'auto'
    })
  }

  onApply(): void {
    this.filtersApplied.emit(this.draftFilters)
    this.modalService.dismissAll()
  }

  onCancel(): void {
    this.modalService.dismissAll()
  }
}