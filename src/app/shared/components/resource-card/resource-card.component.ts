import { Component, Input } from "@angular/core";
import { ChallengeService } from "../../../services/challenge.service";
import { ResourceService } from "src/app/services/resource.service";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: "app-resource-card",
	templateUrl: "./resource-card.component.html",
	styleUrls: ["./resource-card.component.scss"],
	providers: [ChallengeService],
})
export class ResourceCardComponent {
	@Input() author = ""; // componente padre es challenge component
	@Input() date!: Date;
	@Input() id = "";
	@Input() description = "";

	// Resource details
	resourceTitle!: string ;
	resourceDescription!: string ;
	resourceUser!: string ;
	resourceId!: string ;

	// Topic details
	topicId!: string ;
	topicName!: string ;

	constructor(
		private challengeService: ChallengeService,
		private resourceService: ResourceService,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		// Get the resource ID from somewhere (e.g., route parameters)
		this.resourceId = this.route.snapshot.paramMap.get("id") || "";

		// Fetch the resource data
		this.resourceService.getResource(this.resourceId).subscribe((data) => {
			// Bind the resource data
			if (data.resources.length > 0) {
				const resource = data.resources[0];
				this.resourceTitle = resource.title;
				this.resourceDescription = resource.description;
				this.resourceUser = resource.user;
			}
			// Bind the topic data
			this.topicId = data.topic.id;
			this.topicName = data.topic.name;
		});
	}
}
