import { resolve } from 'path';
import { ResourceResponse } from '../../../models/resource.interface';
import { Resource } from 'src/app/models/resource.model';
import { Component, Input, OnInit } from '@angular/core';
import { ChallengeService } from '../../../services/challenge.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { error } from 'console';
import { resolve4 } from 'dns/promises';

@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.scss'],
  providers: [ChallengeService, ResourcesService]
})
export class ResourceCardComponent implements OnInit {
  
  @Input() inputResources: any = "";
  public resources: ResourceResponse[] = [];

  constructor(private resoursesService: ResourcesService) { }

  ngOnInit(): void {
    this.resoursesService.getResources().subscribe({
      next: (resource: any) => {
        this.resources = resource;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }


}

