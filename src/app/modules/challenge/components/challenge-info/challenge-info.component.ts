import { AfterContentChecked, Component, Input, ViewChild } from "@angular/core";
import { ChallengeDetails } from "src/app/models/challenge-details.model";
import { Example } from "src/app/models/challenge-example.model";
import { Language } from "src/app/models/language.model";
import { ChallengeService } from "../../../../services/challenge.service";
import { Subscription } from "rxjs";
import { DataChallenge } from "../../../../models/data-challenge.model";
import { Challenge } from "../../../../models/challenge.model";
import { NgbModal, NgbNav } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/services/auth.service";
import { SolutionService } from "src/app/services/solution.service";
import { RestrictedModalComponent } from "src/app/modules/modals/restricted-modal/restricted-modal.component";

@Component({
	selector: "app-challenge-info",
	templateUrl: "./challenge-info.component.html",
	styleUrls: ["./challenge-info.component.scss"],
	providers: [ChallengeService],
})
export class ChallengeInfoComponent implements AfterContentChecked {
	isUserSolution: boolean = true;

	constructor(
		private challengeService: ChallengeService,
		private authService: AuthService,
		private solutionService: SolutionService,
		private modalService: NgbModal,
	) {}
	

	@ViewChild("nav") nav!: NgbNav;

	@Input() related: any = [];
	@Input() resources: any = [];
	@Input() details!: ChallengeDetails;
	@Input() solutions: any = [];
	@Input() description!: string;
	@Input() examples: Example[] = [];
	@Input() notes!: string;
	@Input() popularity!: number;
	@Input() languages: Language[] = [];

	solutionsDummy = [{ solutionName: "dummy1" }, { solutionName: "dummy2" }];

	showStatement = true;
	isLogged: boolean = false;
	activeId = 1;
	solutionSent: boolean = false;

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
		this.solutionService.solutionSent$.subscribe((value) => {
			this.isUserSolution = !value;
		});
		// this.authService.isLoggedIn();
		this.loadRelatedChallenge(this.related_id);
		this.checkIfUserIsLoggedIn();
	}

	ngAfterContentChecked(): void {
		const token = localStorage.getItem("authToken");
		const refreshToken = localStorage.getItem("refreshToken");

		if (token && refreshToken) {
			this.isLogged = true;
		}
	}

	checkIfUserIsLoggedIn() {
		const token = localStorage.getItem("authToken");
		const refreshToken = localStorage.getItem("refreshToken");

		if (token && refreshToken) {
			this.isLogged = true;
		}
		if (!this.isLogged) {
			this.openRestrictedModal();
		}
	}

	loadRelatedChallenge(id: string) {
		this.challengeSubs$ = this.challengeService
			.getChallengeById(id)
			.subscribe((challenge) => {
				this.challenge = new Challenge(challenge);
				this.related_title = this.challenge?.challenge_title;
				this.related_creation_date = this.challenge?.creation_date;
				this.related_level = this.challenge?.level;
				this.related_popularity = this.challenge.popularity;
				this.related_languages = this.challenge.languages;
				this.related_id = this.related;
			});
	}

	openRestrictedModal() {
		this.modalService.open(RestrictedModalComponent, {
			backdrop: "static",
			centered: true,
			size: "lg",
		});
	}
}
