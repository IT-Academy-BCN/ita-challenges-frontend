import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Breadcrumb } from '../models/interfaces';
import { Router, NavigationEnd, ActivatedRouteSnapshot, Data } from '@angular/router';

@Injectable({ 
  providedIn: 'root' 
}) 
export class BreadcrumbService { 
 
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]); 
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable(); 
 
  constructor(private router: Router) { 
    this.router.events.pipe( 
      filter((event) => event instanceof NavigationEnd) 
    ).subscribe(event => { 
      this.createBreadcrumbs(); 
    }); 
  } 

    createBreadcrumbs() {
    const root = this.router.routerState.snapshot.root; 
    const breadcrumbs: Breadcrumb[] = []; 
    this.addBreadcrumb(root, [], breadcrumbs); 

    this._breadcrumbs$.next(breadcrumbs); 
  }
 
private addBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string[], breadcrumbs: Breadcrumb[]) { 
    if (route) { 

        const routeUrl = parentUrl.concat(route.url.map(url => url.path)); 

        if (route.data['breadcrumb']) { 
            const breadcrumb = { 
                label: this.getLabel(route.data), 
                url: '/' + routeUrl.join('/') 
            }; 
            breadcrumbs.push(breadcrumb); 
        }

        if (route.firstChild) {
            this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
        } else {
            // Check if route has query param tab (challenge-info selected tab)
            if(route.queryParamMap.has('tab')) {
                breadcrumbs[breadcrumbs.length - 1].label += ' > ' + route.queryParamMap.get('tab');
            }
        }
    } 
} 

private getLabel(data: Data) { 
    return typeof data['breadcrumb'] === 'function' ? data['breadcrumb'](data) : data['breadcrumb']; 
} 
 
} 
