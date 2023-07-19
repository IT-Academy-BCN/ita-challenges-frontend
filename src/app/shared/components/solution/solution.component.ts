import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss']
})
export class SolutionComponent implements OnInit {

  @Input() number?: number;

  constructor() { }

  ngOnInit(): void {
  }


}
