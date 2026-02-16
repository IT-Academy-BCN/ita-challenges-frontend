import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-difficulty-level',
  templateUrl: './difficulty-level.component.html',
  styleUrl: './difficulty-level.component.scss',
})
export class DifficultyLevelComponent {
  @Input() level: string = ''
}
