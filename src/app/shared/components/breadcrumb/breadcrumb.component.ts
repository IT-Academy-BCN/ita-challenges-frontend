import { Component, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type Breadcrumb } from 'src/app/models/breadcrumb'
import { BreadcrumbService } from '../../../services/breadcrumb.service'

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  private readonly breadcrumbService = inject(BreadcrumbService)
  breadcrumbs$: Observable<Breadcrumb[]>

  constructor () {
    this.breadcrumbService.createBreadcrumbs()
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$
  }
}
