import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  1: 'details',
  2: 'solutions',
  3: 'resources',
  4: 'related'
};

  constructor(private router: Router, private route: ActivatedRoute) { }

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
    this.router.navigate([], { queryParams: { tab: this.tabNames[changeEvent.nextId] }});
  }

getTabId(tabName: string): number {
  const tabId = Object.keys(this.tabNames).find(key => this.tabNames[key] === tabName);
  return tabId ? Number(tabId) : this.initialActiveId;
}



}
