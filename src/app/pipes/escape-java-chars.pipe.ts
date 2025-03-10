import { Pipe, type PipeTransform } from '@angular/core'

@Pipe({
  name: 'escapeJavaForJson',
  pure: true,
  standalone: true
})
export class EscapeJavaForJsonPipe implements PipeTransform {
  transform (value: string): string {
    return value
      .replace(/\\/g, '\\\\') // Replace backslashes
      .replace(/"/g, '\\"') // Replace double quotes
      .replace(/'/g, '\\\'') // Replace single quotes
      .replace(/\f/g, '\\f') // Replace form feed
      .replace(/\n/g, '\\n') // Replace new line
      .replace(/\r/g, '\\r') // Replace carriage return
      .replace(/\t/g, '\\t') // Replace tab
      .replace(/</g, '\\u003C') // Replace less than
      .replace(/>/g, '\\u003E') // Replace greater than
      .replace(/&/g, '\\u0026') // Replace ampersand
  }
}
