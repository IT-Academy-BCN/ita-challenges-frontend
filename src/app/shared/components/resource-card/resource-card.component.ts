import { type ResourceResponse } from '../../../models/resource.interface'
import { Component, Input, type OnInit } from '@angular/core'
import { ChallengeService } from '../../../services/challenge.service'
import { ResourcesService } from 'src/app/services/resources.service'

@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.scss'],
  providers: [ChallengeService, ResourcesService]
})
export class ResourceCardComponent implements OnInit {
  @Input() inputResources: any = ''
  public resources: ResourceResponse[] = []

  constructor (private readonly resoursesService: ResourcesService) { }

  ngOnInit (): void {
    this.resoursesService.getResources().subscribe({
      next: (resource: any) => {
        this.resources = resource
      },
      error: (error: any) => {
        console.error(error)
      }
    })
  }
}
