import { Component, Input } from '@angular/core'
import { Tag } from 'src/app/models/tag-response.interface'

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss',
})
export class TagsComponent {
  @Input() tags: Tag[] = []
}
