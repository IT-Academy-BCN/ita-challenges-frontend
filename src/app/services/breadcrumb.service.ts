import { Injectable, inject } from '@angular/core'
import { BehaviorSubject, type Subscription, filter } from 'rxjs'
import { type Breadcrumb } from '../models/breadcrumb'
import { Router, NavigationEnd, type ActivatedRouteSnapshot, type Data } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private readonly router = inject(Router)

  _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([])
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable()
  subs: Subscription = this.breadcrumbs$.subscribe(res => {})

  constructor () {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.createBreadcrumbs()
    })
  }

  createBreadcrumbs (): void {
    const root = this.router.routerState.snapshot.root
    const breadcrumbs: Breadcrumb[] = []
    this.addBreadcrumb(root, [], breadcrumbs)
    this._breadcrumbs$.next(breadcrumbs)
  }

  private addBreadcrumb (route: ActivatedRouteSnapshot, parentUrl: string[], breadcrumbs: Breadcrumb[]): void {
    if (route !== null) {
      const routeUrl = parentUrl.concat(route.url.map(url => url.path))

      if (route.data['breadcrumb'] !== 'undefined') {
        const breadcrumb: Breadcrumb = {
          label: String(this.getLabel(route.data)), // Ensure label is of type string
          url: '/' + routeUrl.join('/')
        }
        breadcrumbs.push(breadcrumb)
      }

      if (route.firstChild !== null) {
        this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs)
      } else {
        // Check if route has query param tab (challenge-info selected tab)
        if (route.queryParamMap.has('tab')) {
          breadcrumbs[breadcrumbs.length - 1].label += ' > ' + route.queryParamMap.get('tab')
        }
      }
    }
  }

  private getLabel (data: Data): Data {
    return typeof data['breadcrumb'] === 'function' ? data['breadcrumb'](data) : data['breadcrumb']
  }
}
