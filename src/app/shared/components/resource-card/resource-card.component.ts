import { type ResourceResponse } from '../../../models/resource.interface'
import { Component, Input, inject, type OnInit } from '@angular/core'
import { ChallengeService } from '../../../services/challenge.service'
import { ResourcesService } from 'src/app/services/resources.service'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.scss'],
  providers: []
})
export class ResourceCardComponent implements OnInit {
  private readonly challengeService = inject(ChallengeService)
  private readonly resourcesService = inject(ResourcesService)
  private readonly translate = inject(TranslateService)

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

  get currentLang (): string {
    return this.translate.currentLang
  }
}
