import { Component, Input, ViewChild } from '@angular/core';
import { ChallengeDetails } from 'src/app/models/challenge-details.model';
import { Example } from 'src/app/models/challenge-example.model';
import { Language } from 'src/app/models/language.model';
import { ChallengeService } from '../../../../services/challenge.service';
import { Subscription } from 'rxjs';
import {DataChallenge} from "../../../../models/data-challenge.model";
import { Challenge } from "../../../../models/challenge.model";
import { NgbNav, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrls: ['./challenge-info.component.scss'],
  providers: [ChallengeService]
})
export class ChallengeInfoComponent {
  constructor(private challengeService: ChallengeService,
  private router: Router, private route: ActivatedRoute) { }
  @ViewChild('nav') nav!: NgbNav;

  @Input() related: any = [];
  @Input() resources: any = [];
  @Input() details!: ChallengeDetails;
  @Input() solutions: any = [];
  @Input() description!: string;
  @Input() examples: Example[] = [];
  @Input() notes!: string;
  @Input() popularity!: number;
  @Input() languages: Language[] = []

  solutionsDummy = [{solutionName: 'dummy1'}, {solutionName: 'dummy2'}];

  showStatement = true;
  isLogged = true;
  activeId = 1;

  tabNames: any = {
  1: 'Detalles',
  2: 'Soluciones',
  3: 'Recursos',
  4: 'Relacionados'
};

  idChallenge!: string | any;
  params$!: Subscription;
  jsonData: Challenge[] = [];
  challenge!: Challenge;
  dataChallenge!: DataChallenge;
  challenges: Challenge[] = [];
  challengeSubs$!: Subscription;
  
  related_title = "";
  related_creation_date!: Date;
  related_level = "";
  related_popularity!: number;
  related_languages: Language[] = [];
  related_id = this.related;

  ngOnInit() {
      if (!this.route.snapshot!.queryParams['tab']) {
      this.navigateToQueryParams("Detalles");
    }
    this.loadRelatedChallenge(this.related_id);
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

  loadRelatedChallenge(id: string) {
    this.challengeSubs$ = this.challengeService.getChallengeById(id).subscribe((challenge) => {
      this.challenge = new Challenge(challenge); 
      this.related_title = this.challenge?.challenge_title;
      this.related_creation_date = this.challenge?.creation_date;
      this.related_level = this.challenge?.level;
      this.related_popularity = this.challenge.popularity;
      this.related_languages = this.challenge.languages;
      this.related_id = this.related;      
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
  return tabId ? Number(tabId) : this.activeId;
  }

}