import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgbNavChangeEvent, NgbNav } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrls: ['./challenge-info.component.scss']
})
export class ChallengeInfoComponent {
  @ViewChild('nav') nav!: NgbNav;

  initialActiveId = 1;

  tabNames: any = {
  1: 'Detalles',
  2: 'Soluciones',
  3: 'Recursos',
  4: 'Relacionados'
};

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.snapshot.params && !this.route.snapshot!.params['tab']) {
      this.navigateToQueryParams("Detalles");
    }
  }

    ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab) {
        const tabId = this.getTabId(tab);
        this.nav.select(tabId);
      }
    });
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    this.navigateToQueryParams( this.tabNames[changeEvent.nextId]);
  }

  navigateToQueryParams(paramValue:string) {
    this.router.navigate([], { queryParams: { tab: paramValue }});
  }

getTabId(tabName: string): number {
  const tabId = Object.keys(this.tabNames).find(key => this.tabNames[key] === tabName);
  return tabId ? Number(tabId) : this.initialActiveId;
}



}
