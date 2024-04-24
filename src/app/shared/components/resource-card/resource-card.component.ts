import { type ResourceResponse } from '../../../models/resource.interface'
import { Component, Input, inject, type OnInit } from '@angular/core'
import { ChallengeService } from '../../../services/challenge.service'
import { ResourcesService } from 'src/app/services/resources.service'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.scss'],
  providers: [DatePipe]
})
export class ResourceCardComponent implements OnInit {
  private readonly challengeService = inject(ChallengeService)
  private readonly resourcesService = inject(ResourcesService)
  private readonly datePipe = inject(DatePipe)

  @Input() inputResources: any = ''
  public resources: ResourceResponse[] = []

  ngOnInit (): void {
    this.resourcesService.getResources().subscribe({
      next: (resource: any) => {
        this.resources = resource
      },
      error: (error: any) => {
        console.error(error)
      }
    })
  }

  formatDate (date: string | null): string | null {
    if (date !== null) {
      return this.datePipe.transform(date, 'MMM d, y')
    }
    return ''
  }
}
