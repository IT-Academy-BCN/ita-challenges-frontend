import { Component, Input, inject, type OnInit, type OnDestroy } from '@angular/core'
import { ChallengeService } from '../../../services/challenge.service'
import { ResourcesService } from 'src/app/services/resources.service'
import { DateFormatterService } from 'src/app/services/date-formatter.service'
import { TranslateService } from '@ngx-translate/core'
import { type Subscription } from 'rxjs'
import { type ResourceResponse } from '../../../models/resource.interface'

@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.scss'],
  providers: []
})
export class ResourceCardComponent implements OnInit, OnDestroy {
  private readonly challengeService = inject(ChallengeService)
  private readonly resourcesService = inject(ResourcesService)
  private readonly dateFormatterService = inject(DateFormatterService)
  private readonly translate = inject(TranslateService)
  private translateSubscription!: Subscription

  @Input() inputResources: any = ''
  public resources: ResourceResponse[] = []

  ngOnInit (): void {
    this.resourcesService.getResources().subscribe({
      next: (resource: any) => {
        this.resources = resource
        this.updateFormattedDates() // Actualiza las fechas al cargar los recursos.
      },
      error: (error: any) => {
        console.error(error)
      }
    })

    // Suscribirse a cambios de idioma y actualizar las fechas formateadas.
    this.translateSubscription = this.translate.onLangChange.subscribe(() => {
      this.updateFormattedDates()
    })
  }

  ngOnDestroy (): void {
  // Desuscribirse para evitar fugas de memoria.
    if (this.translateSubscription != null) {
      this.translateSubscription.unsubscribe()
    }
  }

  public formatResourceDate (date: Date): string {
    return this.dateFormatterService.format(date)
  }

  private updateFormattedDates (): void {
    // Actualiza las fechas formateadas de los recursos.
    this.resources = this.resources.map(resource => ({
      ...resource,
      formattedDate: this.formatResourceDate(new Date(resource.createdAt))
    }))
  }
}
