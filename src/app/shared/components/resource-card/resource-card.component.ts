import { Component, Input } from "@angular/core";
import { ChallengeService } from "../../../services/challenge.service";

@Component({
	selector: "app-resource-card",
	templateUrl: "./resource-card.component.html",
	styleUrls: ["./resource-card.component.scss"],
	providers: [ChallengeService],
})
export class ResourceCardComponent {
	constructor(private challengeService: ChallengeService) {}

	@Input() author = ""; // componente padre es challenge component 
	@Input() date!: Date;
	@Input() id = "";
	@Input() description = "";

	resourceId: string = "clpjl23dm000bjz0ig40fajyg"; // fonaments
	resourceTitle: string = "Diagrama Entitat - Relació";
	resourceDescription: string = "aqui va la description del recurso";
  userAuthor : string = 'Valerio'

	topicId: string = "clpjkx4540009jz0ips2i30ca";
	categoryId: string = "clp836psr000108l78qfzekxq";
	topicIdname: string = "Fonaments BBDD";
}
